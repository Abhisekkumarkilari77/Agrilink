package com.agrilink.config;

import com.agrilink.entity.auth.User;
import com.agrilink.entity.farmer.Farm;
import com.agrilink.entity.product.Category;
import com.agrilink.entity.product.Product;
import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import com.agrilink.repository.CategoryRepository;
import com.agrilink.repository.FarmRepository;
import com.agrilink.repository.ProductRepository;
import com.agrilink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FarmRepository farmRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Admin
        if (!userRepository.existsByEmail("admin@agrilink.com")) {
            userRepository.save(User.builder()
                    .name("AgriLink Admin")
                    .email("admin@agrilink.com")
                    .mobile("9000000001")
                    .password(passwordEncoder.encode("admin123"))
                    .role(RoleType.ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .build());
        }

        // 2. Super Admin
        if (!userRepository.existsByEmail("superadmin@agrilink.com")) {
            userRepository.save(User.builder()
                    .name("System Super Admin")
                    .email("superadmin@agrilink.com")
                    .mobile("9000000000")
                    .password(passwordEncoder.encode("superadmin123"))
                    .role(RoleType.SUPER_ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .build());
        }

        // 3. Farmers & Farms
        User farmer1 = getOrCreateFarmer("farmer@agrilink.com", "Rajesh Kumar", "9876543211", "Rajesh Organic Farm");
        User farmer2 = getOrCreateFarmer("ramesh@agrilink.com", "Ramesh Patel", "9876543212", "Green Earth Organics");
        User farmer3 = getOrCreateFarmer("sunita@agrilink.com", "Sunita Devi", "9876543214", "Sunrise Agro Farm");
        User farmer4 = getOrCreateFarmer("suresh@agrilink.com", "Suresh Gowda", "9876543215", "Gowda Dairy & Agriculture");
        User farmer5 = getOrCreateFarmer("lakshmi@agrilink.com", "Lakshmi Naidu", "9876543216", "Naidu Eco Farm");

        seedFarms(Arrays.asList(farmer1, farmer2, farmer3, farmer4, farmer5));

        // 4. Delivery Partner
        if (!userRepository.existsByEmail("delivery@agrilink.com")) {
            userRepository.save(User.builder()
                    .name("Ravi Kumar")
                    .email("delivery@agrilink.com")
                    .mobile("9876543213")
                    .password(passwordEncoder.encode("delivery123"))
                    .role(RoleType.DELIVERY)
                    .status(AccountStatus.ACTIVE)
                    .vehicleNumber("KA-01-EF-4567")
                    .build());
        }

        // 5. Seed 20 Categories
        List<String> categoryNames = Arrays.asList(
                "Vegetables", "Fruits", "Leafy Vegetables", "Cereals", "Pulses",
                "Rice", "Wheat", "Millets", "Spices", "Dry Fruits",
                "Dairy", "Eggs", "Honey", "Flowers", "Herbs",
                "Seeds", "Organic Products", "Fertilizers", "Plants", "Seasonal Products"
        );

        for (String catName : categoryNames) {
            if (!categoryRepository.existsByName(catName)) {
                categoryRepository.save(Category.builder()
                        .name(catName)
                        .description("Fresh farm produce & agricultural supplies - " + catName)
                        .build());
            }
        }

        // 6. Seed 200+ Products if total count < 100
        if (productRepository.count() < 100) {
            productRepository.deleteAll(); // re-seed cleanly for 200+ products
            List<Product> products = new ArrayList<>();
            List<User> farmers = Arrays.asList(farmer1, farmer2, farmer3, farmer4, farmer5);

            for (int catIdx = 0; catIdx < categoryNames.size(); catIdx++) {
                String cat = categoryNames.get(catIdx);
                for (int itemIdx = 1; itemIdx <= 10; itemIdx++) {
                    User farmUser = farmers.get((catIdx + itemIdx) % farmers.size());
                    Product p = createSeededProduct(cat, itemIdx, farmUser);
                    products.add(p);
                }
            }

            productRepository.saveAll(products);
            System.out.println("✅ Successfully seeded 200 Products across 20 Categories into MongoDB!");
        }
    }

    private User getOrCreateFarmer(String email, String name, String mobile, String farmName) {
        return userRepository.findByEmail(email).orElseGet(() ->
                userRepository.save(User.builder()
                        .name(name)
                        .email(email)
                        .mobile(mobile)
                        .password(passwordEncoder.encode("farmer123"))
                        .role(RoleType.FARMER)
                        .status(AccountStatus.ACTIVE)
                        .farmName(farmName)
                        .aadhaarNumber("123456789" + mobile.substring(7))
                        .build())
        );
    }

    private void seedFarms(List<User> farmers) {
        if (farmRepository.count() == 0) {
            List<Farm> farms = Arrays.asList(
                    Farm.builder().farmerId(farmers.get(0).getId()).farmName(farmers.get(0).getFarmName()).farmType("Organic Vegetables & Fruits").description("Certified 100% organic farm with drip irrigation.").state("Karnataka").district("Bengaluru Rural").village("Nelamangala").completeAddress("Survey No. 42, Nelamangala Road").pincode("562123").lat("13.0984").lng("77.3982").contact("9876543211").workingHours("6 AM - 7 PM").certificates(Arrays.asList("NPOP Organic", "Jaivik Bharat")).build(),
                    Farm.builder().farmerId(farmers.get(1).getId()).farmName(farmers.get(1).getFarmName()).farmType("Grain & Sugarcane").description("Sustainable multi-crop farm producing premium pulses and rice.").state("Karnataka").district("Mandya").village("Srirangapatna").completeAddress("Farmhouse 12, River Bank").pincode("571438").lat("12.4223").lng("76.6953").contact("9876543212").workingHours("7 AM - 6 PM").certificates(Arrays.asList("FSSAI Registered")).build(),
                    Farm.builder().farmerId(farmers.get(2).getId()).farmName(farmers.get(2).getFarmName()).farmType("Flowers & Exotic Vegetables").description("High-tech polyhouse farm growing fresh cut flowers and herbs.").state("Karnataka").district("Doddaballapur").village("Tubuagere").completeAddress("Plot 88, Polyhouse Zone").pincode("561203").lat("13.2928").lng("77.5412").contact("9876543214").workingHours("5 AM - 8 PM").certificates(Arrays.asList("Global GAP")).build(),
                    Farm.builder().farmerId(farmers.get(3).getId()).farmName(farmers.get(3).getFarmName()).farmType("Dairy & Free Range Eggs").description("Ethical dairy farm with free-range Gir cows and country poultry.").state("Karnataka").district("Kolar").village("Bangarapet").completeAddress("Gowda Dairy Estate, SH-96").pincode("563114").lat("12.9834").lng("78.1834").contact("9876543215").workingHours("5 AM - 9 PM").certificates(Arrays.asList("Pure Dairy Standard")).build(),
                    Farm.builder().farmerId(farmers.get(4).getId()).farmName(farmers.get(4).getFarmName()).farmType("Herbs, Spices & Honey").description("Natural forest-edge farm producing wild honey, turmeric and medicinal herbs.").state("Andhra Pradesh").district("Chittoor").village("Palamaner").completeAddress("Naidu Herbal Estate, NH-75").pincode("517408").lat("13.2001").lng("78.7523").contact("9876543216").workingHours("6 AM - 6 PM").certificates(Arrays.asList("Khadi Village Certified")).build()
            );
            farmRepository.saveAll(farms);
        }
    }

    private Product createSeededProduct(String cat, int idx, User farmer) {
        String name = getProductName(cat, idx);
        double price = getProductPrice(cat, idx);
        String unit = getProductUnit(cat, idx);
        String image = getProductImage(cat, idx);
        double distance = 2.5 + (idx * 1.3) + (cat.hashCode() % 5);
        double rating = 4.2 + (idx % 8) * 0.1;
        boolean organic = (idx % 2 == 0) || cat.contains("Organic") || cat.contains("Herbs");

        List<String> gallery = Arrays.asList(
                image,
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
                "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80"
        );

        return Product.builder()
                .farmerId(farmer.getId())
                .farmerName(farmer.getName())
                .farmName(farmer.getFarmName())
                .name(name)
                .category(cat)
                .price(price)
                .discount(idx % 3 == 0 ? 10.0 : 0.0)
                .quantity(50 + idx * 15)
                .unit(unit)
                .organic(organic)
                .rating(Math.min(5.0, Math.round(rating * 10.0) / 10.0))
                .reviewCount(15 + idx * 7)
                .distance(Math.round(distance * 10.0) / 10.0)
                .harvestDate("2026-07-20")
                .freshness("High")
                .deliveryTime(idx % 2 == 0 ? "2-4 hrs" : "Same Day")
                .description("Freshly harvested " + name + " directly from " + farmer.getFarmName() + ". 100% farm-fresh, pesticide-tested, and chemical-free.")
                .image(image)
                .images(gallery)
                .status("Available")
                .ordersReceived(5 + idx * 3)
                .build();
    }

    private String getProductName(String cat, int idx) {
        return switch (cat) {
            case "Vegetables" -> new String[]{"Vine Farm Tomatoes", "Fresh Hybrid Capsicum", "Organic Red Onions", "Farm Crisp Carrots", "Green Farm Cucumbers", "Fresh Potatoes", "Organic Cauliflower", "Green Peas", "Fresh Beetroots", "Bottle Gourd"}[idx - 1];
            case "Fruits" -> new String[]{"Fresh Alphonso Mangoes", "Sweet Farm Bananas", "Organic Royal Apples", "Fresh Green Grapes", "Papaya Farm Fresh", "Ripe Sweet Pomegranate", "Guava (Lucknow 49)", "Juicy Oranges", "Fresh Dragon Fruit", "Organic Watermelon"}[idx - 1];
            case "Leafy Vegetables" -> new String[]{"Fresh Spinach (Palak)", "Organic Coriander Leaves", "Fresh Mint Leaves", "Fenugreek Leaves (Methi)", "Amaranthus (Thotakura)", "Curry Leaves", "Spring Onion Bundle", "Lettuce Crisp", "Mustard Greens", "Dill Leaves (Sabbakshi)"}[idx - 1];
            case "Cereals" -> new String[]{"Whole Grain Corn (Makka)", "Farm Pearl Barley", "Sorghum Whole Grain", "Oats Whole Grain", "Grain Rye", "Ragi Whole Grain", "Proso Millet Grain", "Barnyard Cereals", "Kodo Cereals", "Foxtail Whole Cereals"}[idx - 1];
            case "Pulses" -> new String[]{"Organic Toor Dal", "Yellow Moong Dal", "Whole Urad Dal", "Kabuli Chana (Chickpeas)", "Green Moong Whole", "Masoor Dal (Red Lentil)", "Rajma (Red Kidney Beans)", "Black Eyed Beans (Lobiya)", "Horse Gram (Kulthi)", "White Peas"}[idx - 1];
            case "Rice" -> new String[]{"Premium Basmati Rice", "Sona Masoori Raw Rice", "Brown Basmati Rice", "Indrayani Aromatic Rice", "Black Forbidden Rice", "Red Matta Rice", "Wada Kolam Rice", "Jeera Samba Rice", "Organic Boiled Rice", "Bamboo Seed Rice"}[idx - 1];
            case "Wheat" -> new String[]{"Sharbati Whole Wheat", "Organic Khapli Wheat (Emmer)", "Lokwan Wheat Flour (Atta)", "Whole Grain Durum Wheat", "Multi-Grain Atta Mix", "Bansi Wheat", "Spelt Whole Wheat", "Organic Dalia (Broken Wheat)", "Maida Fine Wheat", "Wheat Bran Supplement"}[idx - 1];
            case "Millets" -> new String[]{"Organic Finger Millet (Ragi)", "Pearl Millet (Bajra)", "Foxtail Millet (Kangni)", "Little Millet (Samai)", "Kodo Millet (Varagu)", "Barnyard Millet (Sanwa)", "Proso Millet (Chena)", "Browntop Millet", "Sorghum Flakes (Jowar)", "Millet Noodle Mix"}[idx - 1];
            case "Spices" -> new String[]{"Organic Lakadong Turmeric", "Kashmiri Red Chilli Powder", "Whole Black Pepper", "Green Cardamom (Elaichi)", "Ceylon Cinnamon Sticks", "Cumin Seeds (Jeera)", "Mustard Seeds (Rai)", "Coriander Seeds (Dhania)", "Cloves (Laung)", "Dry Ginger Powder"}[idx - 1];
            case "Dry Fruits" -> new String[]{"Premium Kashmiri Almonds", "Whole King Cashews", "Organic Walnuts (Akhrot)", "Afghan Black Raisins", "Dried Figs (Anjeer)", "Pistachios Roasted", "Dry Dates (Kharik)", "Dried Blueberries", "Prunes Organic", "Dry Fruit Celebration Mix"}[idx - 1];
            case "Dairy" -> new String[]{"Pure Cow Milk (A2)", "Fresh Buffalo Milk", "Farm Fresh Curd (Dahi)", "Traditional A2 Desi Ghee", "Fresh Malai Paneer", "Natural Farm Butter", "Sweet Buttermilk (Chaas)", "Fresh Cow Milk Cream", "Organic Khoya/Mawa", "Flavored Badam Milk"}[idx - 1];
            case "Eggs" -> new String[]{"Free Range Country Eggs (12)", "Organic Brown Eggs (6)", "Quail Eggs Pack (24)", "Duck Farm Eggs (6)", "Omega-3 Enriched Eggs (10)", "Pasture Raised White Eggs (12)", "Double Yolk Country Eggs (6)", "Herbal Fed Chicken Eggs (6)", "Local Village Eggs (12)", "Egg White Pack"}[idx - 1];
            case "Honey" -> new String[]{"Raw Forest Wild Honey", "Mustard Blossom Honey", "Eucalyptus Pure Honey", "Multiflora Organic Honey", "Sunderban Mangrove Honey", "Comb Fresh Honey", "Acacia Pure Honey", "Ajwain Infused Honey", "Tulsi Medicinal Honey", "Sidr Organic Honey"}[idx - 1];
            case "Flowers" -> new String[]{"Fresh Red Roses (Bunch)", "Yellow Marigold (Genda)", "Jasmine Garland (Mogra)", "Cut Carnations Mix", "Fresh Tuberose (Rajnigandha)", "Orchid Stems Pink", "Gerbera Daisy Pack", "Chrysanthemum Mix", "Lotus Blooms (3)", "Exotic Flower Bouquet"}[idx - 1];
            case "Herbs" -> new String[]{"Fresh Basil Leaves (Tulsi)", "Rosemary Stems Fresh", "Thyme Herbal Sprigs", "Oregano Fresh Stems", "Lemongrass Stems", "Aloe Vera Fresh Leaves", "Ashwagandha Roots", "Stevia Green Leaves", "Parsley Italian Bunch", "Celery Sticks Fresh"}[idx - 1];
            case "Seeds" -> new String[]{"Raw Chia Seeds", "Organic Flax Seeds", "Sunflower Seeds Raw", "Pumpkin Seeds Roasted", "Watermelon Seeds", "Sesame Seeds White (Til)", "Black Sesame Seeds", "Quinoa Seeds", "Mustard Planting Seeds", "Spinach Vegetable Seeds"}[idx - 1];
            case "Organic Products" -> new String[]{"Organic Jaggery Powder", "Cold Pressed Coconut Oil", "Wood Pressed Sesame Oil", "Organic Rock Salt (Sendha)", "Raw Coconut Sugar", "Wood Pressed Groundnut Oil", "Natural Apple Cider Vinegar", "Organic Amla Juice", "Handmade Herbal Soap", "Organic Moringa Powder"}[idx - 1];
            case "Fertilizers" -> new String[]{"Organic Vermicompost (5kg)", "Neem Cake Fertilizer", "Bone Meal Organic Soil", "Bio-Enzyme Plant Booster", "Cow Dung Compost (10kg)", "Seaweed Liquid Fertilizer", "Cocopeat Block (5kg)", "Trichoderma Bio-Fungicide", "Epsom Salt Soil Nutrient", "Mycorrhiza Bio-Fertilizer"}[idx - 1];
            case "Plants" -> new String[]{"Fresh Tulsi Plant Pot", "Aloe Vera Live Plant", "Curry Leaf Live Tree", "Snake Air Purifier Plant", "Money Plant Green Pot", "Red Rose Bush Live", "Jasmine Flowering Shrub", "Lemon Plant Grafted", "Mint Live Herb Pot", "Bonsai Ficus Plant"}[idx - 1];
            case "Seasonal Products" -> new String[]{"Fresh Sweet Corn Cob", "Winter Green Peas Pods", "Summer Ice Apples (Tadgola)", "Monsoon Fresh Jamun", "Festive Sugarcane Stems", "Spring Strawberry Pack", "Raw Mango (Kaccha Aam)", "Fresh Water Chestnuts", "Seasonal Tender Coconut", "Custard Apples (Sitaphal)"}[idx - 1];
            default -> cat + " Item #" + idx;
        };
    }

    private double getProductPrice(String cat, int idx) {
        return switch (cat) {
            case "Vegetables", "Leafy Vegetables" -> 20.0 + idx * 8.0;
            case "Fruits", "Seasonal Products" -> 40.0 + idx * 15.0;
            case "Cereals", "Pulses", "Rice", "Wheat", "Millets" -> 60.0 + idx * 12.0;
            case "Spices", "Dry Fruits", "Honey", "Organic Products" -> 120.0 + idx * 35.0;
            case "Dairy", "Eggs", "Flowers", "Herbs", "Seeds" -> 45.0 + idx * 10.0;
            case "Fertilizers", "Plants" -> 90.0 + idx * 25.0;
            default -> 50.0 + idx * 10.0;
        };
    }

    private String getProductUnit(String cat, int idx) {
        return switch (cat) {
            case "Dairy" -> idx % 2 == 0 ? "litre" : "pack";
            case "Eggs" -> "pack";
            case "Flowers", "Leafy Vegetables", "Herbs" -> "bundle";
            case "Plants", "Fertilizers" -> "unit";
            case "Honey" -> "bottle";
            default -> "kg";
        };
    }

    private String getProductImage(String cat, int idx) {
        String[] vegImgs = {
                "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80",
                "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80",
                "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80",
                "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80",
                "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80"
        };
        String[] fruitImgs = {
                "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80",
                "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80",
                "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80",
                "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80"
        };
        String[] grainImgs = {
                "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
                "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80",
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"
        };
        String[] dairyImgs = {
                "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80",
                "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=500&q=80"
        };

        if (cat.contains("Fruit")) return fruitImgs[idx % fruitImgs.length];
        if (cat.contains("Dairy")) return dairyImgs[idx % dairyImgs.length];
        if (cat.contains("Rice") || cat.contains("Wheat") || cat.contains("Grain") || cat.contains("Pulses")) return grainImgs[idx % grainImgs.length];
        return vegImgs[idx % vegImgs.length];
    }
}
