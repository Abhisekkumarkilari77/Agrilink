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
import java.util.Map;
import java.util.HashMap;

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

        // 6. Seed 50 Default Products (Always refresh/re-seed to guarantee correct image mappings and no stale products)
        productRepository.deleteAll();
        seedDefaultProducts(Arrays.asList(farmer1, farmer2, farmer3, farmer4, farmer5));
    }

    private void seedDefaultProducts(List<User> farmers) {
        List<Product> products = new ArrayList<>();
        
        // Define Categories and Item Arrays
        String[][] categoriesAndItems = {
            {
                "Vegetables",
                "Tomato", "Potato", "Onion", "Brinjal", "Bottle Gourd",
                "Bitter Gourd", "Cauliflower", "Cabbage", "Capsicum", "Carrot",
                "Beans", "Beetroot", "Radish", "Spinach", "Mint",
                "Coriander", "Drumstick", "Lady Finger", "Green Chilli"
            },
            {
                "Fruits",
                "Mango", "Banana", "Apple", "Orange", "Papaya",
                "Watermelon", "Guava", "Pomegranate", "Dragon Fruit", "Pineapple"
            },
            {
                "Grains",
                "Rice", "Wheat", "Foxtail Millet", "Pearl Millet", "Ragi"
            },
            {
                "Pulses",
                "Rajma", "Green Gram", "Black Gram", "Toor Dal", "Bengal Gram"
            },
            {
                "Spices",
                "Turmeric", "Black Pepper", "Cardamom", "Coriander Seeds", "Cumin"
            },
            {
                "Dairy",
                "Milk", "Paneer", "Butter", "Cheese", "Honey", "Ghee"
            }
        };

        // Static Pexels/Pixabay Image Mapping
        Map<String, String> nonUnsplashImages = new HashMap<>();
        nonUnsplashImages.put("Tomato", "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Potato", "https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Onion", "https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Brinjal", "https://images.pexels.com/photos/321552/pexels-photo-321552.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Bottle Gourd", "https://images.pexels.com/photos/5945903/pexels-photo-5945903.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Bitter Gourd", "https://images.pexels.com/photos/5945903/pexels-photo-5945903.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Cauliflower", "https://images.pexels.com/photos/461271/pexels-photo-461271.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Cabbage", "https://images.pexels.com/photos/2518874/pexels-photo-2518874.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Capsicum", "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Carrot", "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Beans", "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Beetroot", "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Radish", "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Spinach", "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Mint", "https://images.pexels.com/photos/6086862/pexels-photo-6086862.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Coriander", "https://images.pexels.com/photos/1081015/pexels-photo-1081015.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Drumstick", "https://images.pexels.com/photos/5945903/pexels-photo-5945903.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Lady Finger", "https://images.pexels.com/photos/2583187/pexels-photo-2583187.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Green Chilli", "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400");

        nonUnsplashImages.put("Mango", "https://images.pexels.com/photos/2290293/pexels-photo-2290293.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Banana", "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Apple", "https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Orange", "https://images.pexels.com/photos/2090901/pexels-photo-2090901.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Papaya", "https://images.pexels.com/photos/3658434/pexels-photo-3658434.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Watermelon", "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Guava", "https://images.pexels.com/photos/3283626/pexels-photo-3283626.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Pomegranate", "https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Dragon Fruit", "https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Pineapple", "https://images.pexels.com/photos/947883/pexels-photo-947883.jpeg?auto=compress&cs=tinysrgb&w=400");

        nonUnsplashImages.put("Rice", "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Wheat", "https://images.pexels.com/photos/1070058/pexels-photo-1070058.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Foxtail Millet", "https://images.pexels.com/photos/59944/pexels-photo-59944.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Pearl Millet", "https://images.pexels.com/photos/59944/pexels-photo-59944.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Ragi", "https://images.pexels.com/photos/59944/pexels-photo-59944.jpeg?auto=compress&cs=tinysrgb&w=400");

        nonUnsplashImages.put("Rajma", "https://images.pexels.com/photos/8926438/pexels-photo-8926438.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Green Gram", "https://images.pexels.com/photos/8926451/pexels-photo-8926451.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Black Gram", "https://images.pexels.com/photos/8926451/pexels-photo-8926451.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Toor Dal", "https://images.pexels.com/photos/8926438/pexels-photo-8926438.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Bengal Gram", "https://images.pexels.com/photos/8926438/pexels-photo-8926438.jpeg?auto=compress&cs=tinysrgb&w=400");

        nonUnsplashImages.put("Turmeric", "https://images.pexels.com/photos/6154852/pexels-photo-6154852.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Black Pepper", "https://images.pexels.com/photos/5087370/pexels-photo-5087370.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Cardamom", "https://images.pexels.com/photos/5321326/pexels-photo-5321326.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Coriander Seeds", "https://images.pexels.com/photos/5967970/pexels-photo-5967970.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Cumin", "https://images.pexels.com/photos/6154852/pexels-photo-6154852.jpeg?auto=compress&cs=tinysrgb&w=400");

        nonUnsplashImages.put("Milk", "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Paneer", "https://images.pexels.com/photos/12916867/pexels-photo-12916867.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Butter", "https://images.pexels.com/photos/920220/pexels-photo-920220.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Cheese", "https://images.pexels.com/photos/8213344/pexels-photo-8213344.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Honey", "https://images.pexels.com/photos/5870493/pexels-photo-5870493.jpeg?auto=compress&cs=tinysrgb&w=400");
        nonUnsplashImages.put("Ghee", "https://images.pexels.com/photos/10118334/pexels-photo-10118334.jpeg?auto=compress&cs=tinysrgb&w=400");

        int farmerIndex = 0;
        int globalIndex = 0;

        for (String[] catGroup : categoriesAndItems) {
            String categoryName = catGroup[0];
            for (int i = 1; i < catGroup.length; i++) {
                String itemName = catGroup[i];
                User farmer = farmers.get(farmerIndex % farmers.size());
                farmerIndex++;
                globalIndex++;

                Farm farm = farmRepository.findByFarmerId(farmer.getId()).orElse(null);
                String village = farm != null && farm.getVillage() != null ? farm.getVillage() : "Basinikonda Rural";
                double distance = 1.2 + (globalIndex * 0.4) % 10.0;
                double rating = 4.2 + (globalIndex % 8) * 0.1;
                boolean organic = (globalIndex % 2 == 0) || categoryName.equals("Organic Products") || categoryName.equals("Herbs");

                String imageUrl = nonUnsplashImages.getOrDefault(itemName, "https://images.pexels.com/photos/2286777/pexels-photo-2286777.jpeg?auto=compress&cs=tinysrgb&w=400");

                Product p = Product.builder()
                        .farmerId(farmer.getId())
                        .farmerName(farmer.getName())
                        .farmName(farmer.getFarmName())
                        .name(itemName)
                        .category(categoryName)
                        .price(25.0 + (globalIndex * 5) % 150)
                        .quantity(60 + (globalIndex * 12) % 200)
                        .unit(categoryName.equals("Dairy") ? "litre" : "kg")
                        .organic(organic)
                        .rating(Math.min(5.0, Math.round(rating * 10.0) / 10.0))
                        .reviewCount(10 + globalIndex * 2)
                        .distance(Math.round(distance * 10.0) / 10.0)
                        .harvestDate("2026-07-22")
                        .freshness("High")
                        .deliveryTime(globalIndex % 2 == 0 ? "2-4 hrs" : "Same Day")
                        .description("Freshly harvested " + itemName + " directly from " + farmer.getFarmName() + ". 100% farm-fresh, chemical-free and organic.")
                        .status("AVAILABLE")
                        .isSeeded(true)
                        .village(village)
                        .verifiedFarmer(true)
                        .image(imageUrl)
                        .images(Arrays.asList(imageUrl))
                        .build();

                products.add(p);
            }
        }

        productRepository.saveAll(products);
        System.out.println("✅ Seeded " + products.size() + " default products cleanly into MongoDB!");
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

    private Product createSeededProduct(String cat, int idx, User farmer) {
        String name = getProductName(cat, idx);
        double price = getProductPrice(cat, idx);
        String unit = getProductUnit(cat, idx);
        double distance = 2.5 + (idx * 1.3) + (cat.hashCode() % 5);
        double rating = 4.2 + (idx % 8) * 0.1;
        boolean organic = (idx % 2 == 0) || cat.contains("Organic") || cat.contains("Herbs");

        Product product = Product.builder()
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
                .status("AVAILABLE")
                .ordersReceived(5 + idx * 3)
                .isSeeded(true)
                .build();

        product.setImageUrl(getProductImage(product.getName()));

        List<String> gallery = Arrays.asList(
                product.getImageUrl(),
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
                "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80"
        );
        product.setImages(gallery);

        return product;
    }

    private static final Map<String, String> PRODUCT_IMAGES = new HashMap<>();
    static {
        // Vegetables
        PRODUCT_IMAGES.put("Vine Farm Tomatoes", "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Hybrid Capsicum", "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Red Onions", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80");
        PRODUCT_IMAGES.put("Farm Crisp Carrots", "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80");
        PRODUCT_IMAGES.put("Green Farm Cucumbers", "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Potatoes", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Cauliflower", "https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80");
        PRODUCT_IMAGES.put("Green Peas", "https://images.unsplash.com/photo-1587570220677-668607a64a38?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Beetroots", "https://images.unsplash.com/photo-1587334206574-351ecdb77485?w=500&q=80");
        PRODUCT_IMAGES.put("Bottle Gourd", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80");

        // Fruits
        PRODUCT_IMAGES.put("Fresh Alphonso Mangoes", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80");
        PRODUCT_IMAGES.put("Sweet Farm Bananas", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Royal Apples", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Green Grapes", "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80");
        PRODUCT_IMAGES.put("Papaya Farm Fresh", "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&q=80");
        PRODUCT_IMAGES.put("Ripe Sweet Pomegranate", "https://images.unsplash.com/photo-1541348263662-e0c8643c21ec?w=500&q=80");
        PRODUCT_IMAGES.put("Guava (Lucknow 49)", "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80");
        PRODUCT_IMAGES.put("Juicy Oranges", "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Dragon Fruit", "https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Watermelon", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");

        // Leafy Vegetables
        PRODUCT_IMAGES.put("Fresh Spinach (Palak)", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Coriander Leaves", "https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Mint Leaves", "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&q=80");
        PRODUCT_IMAGES.put("Fenugreek Leaves (Methi)", "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80");
        PRODUCT_IMAGES.put("Amaranthus (Thotakura)", "https://images.unsplash.com/photo-1628134714488-66270725a371?w=500&q=80");
        PRODUCT_IMAGES.put("Curry Leaves", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Spring Onion Bundle", "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?w=500&q=80");
        PRODUCT_IMAGES.put("Lettuce Crisp", "https://images.unsplash.com/photo-1622206194165-246f48597a18?w=500&q=80");
        PRODUCT_IMAGES.put("Mustard Greens", "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80");
        PRODUCT_IMAGES.put("Dill Leaves (Sabbakshi)", "https://images.unsplash.com/photo-1596701062351-852b727be45b?w=500&q=80");

        // Cereals
        PRODUCT_IMAGES.put("Whole Grain Corn (Makka)", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Farm Pearl Barley", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Sorghum Whole Grain", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Oats Whole Grain", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Grain Rye", "https://images.unsplash.com/photo-1600611422773-cbcfdfb7310d?w=500&q=80");
        PRODUCT_IMAGES.put("Ragi Whole Grain", "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80");
        PRODUCT_IMAGES.put("Proso Millet Grain", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Barnyard Cereals", "https://images.unsplash.com/photo-1536620711904-8976b92a2a0b?w=500&q=80");
        PRODUCT_IMAGES.put("Kodo Cereals", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Foxtail Whole Cereals", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");

        // Pulses
        PRODUCT_IMAGES.put("Organic Toor Dal", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Yellow Moong Dal", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Whole Urad Dal", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Kabuli Chana (Chickpeas)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Green Moong Whole", "https://images.unsplash.com/photo-1600611422773-cbcfdfb7310d?w=500&q=80");
        PRODUCT_IMAGES.put("Masoor Dal (Red Lentil)", "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80");
        PRODUCT_IMAGES.put("Rajma (Red Kidney Beans)", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Black Eyed Beans (Lobiya)", "https://images.unsplash.com/photo-1536620711904-8976b92a2a0b?w=500&q=80");
        PRODUCT_IMAGES.put("Horse Gram (Kulthi)", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("White Peas", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");

        // Rice
        PRODUCT_IMAGES.put("Premium Basmati Rice", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Sona Masoori Raw Rice", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Brown Basmati Rice", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Indrayani Aromatic Rice", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Black Forbidden Rice", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Red Matta Rice", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Wada Kolam Rice", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Jeera Samba Rice", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Boiled Rice", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Bamboo Seed Rice", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");

        // Wheat
        PRODUCT_IMAGES.put("Sharbati Whole Wheat", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Khapli Wheat (Emmer)", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Lokwan Wheat Flour (Atta)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Whole Grain Durum Wheat", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Multi-Grain Atta Mix", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Bansi Wheat", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Spelt Whole Wheat", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Dalia (Broken Wheat)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Maida Fine Wheat", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Wheat Bran Supplement", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");

        // Millets
        PRODUCT_IMAGES.put("Organic Finger Millet (Ragi)", "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80");
        PRODUCT_IMAGES.put("Pearl Millet (Bajra)", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Foxtail Millet (Kangni)", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Little Millet (Samai)", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Kodo Millet (Varagu)", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Barnyard Millet (Sanwa)", "https://images.unsplash.com/photo-1536620711904-8976b92a2a0b?w=500&q=80");
        PRODUCT_IMAGES.put("Proso Millet (Chena)", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Browntop Millet", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Sorghum Flakes (Jowar)", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Millet Noodle Mix", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");

        // Spices
        PRODUCT_IMAGES.put("Organic Lakadong Turmeric", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Kashmiri Red Chilli Powder", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80");
        PRODUCT_IMAGES.put("Whole Black Pepper", "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&q=80");
        PRODUCT_IMAGES.put("Green Cardamom (Elaichi)", "https://images.unsplash.com/photo-1532132644265-5152865c6978?w=500&q=80");
        PRODUCT_IMAGES.put("Ceylon Cinnamon Sticks", "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80");
        PRODUCT_IMAGES.put("Cumin Seeds (Jeera)", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Mustard Seeds (Rai)", "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&q=80");
        PRODUCT_IMAGES.put("Coriander Seeds (Dhania)", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80");
        PRODUCT_IMAGES.put("Cloves (Laung)", "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80");
        PRODUCT_IMAGES.put("Dry Ginger Powder", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");

        // Dry Fruits
        PRODUCT_IMAGES.put("Premium Kashmiri Almonds", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Whole King Cashews", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Walnuts (Akhrot)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Afghan Black Raisins", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Dried Figs (Anjeer)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Pistachios Roasted", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Dry Dates (Kharik)", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Dried Blueberries", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Prunes Organic", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Dry Fruit Celebration Mix", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");

        // Dairy
        PRODUCT_IMAGES.put("Pure Cow Milk (A2)", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Buffalo Milk", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80");
        PRODUCT_IMAGES.put("Farm Fresh Curd (Dahi)", "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80");
        PRODUCT_IMAGES.put("Traditional A2 Desi Ghee", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Malai Paneer", "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=500&q=80");
        PRODUCT_IMAGES.put("Natural Farm Butter", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80");
        PRODUCT_IMAGES.put("Sweet Buttermilk (Chaas)", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Cow Milk Cream", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Khoya/Mawa", "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=500&q=80");
        PRODUCT_IMAGES.put("Flavored Badam Milk", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80");

        // Eggs
        PRODUCT_IMAGES.put("Free Range Country Eggs (12)", "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Brown Eggs (6)", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80");
        PRODUCT_IMAGES.put("Quail Eggs Pack (24)", "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80");
        PRODUCT_IMAGES.put("Duck Farm Eggs (6)", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80");
        PRODUCT_IMAGES.put("Omega-3 Enriched Eggs (10)", "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80");
        PRODUCT_IMAGES.put("Pasture Raised White Eggs (12)", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80");
        PRODUCT_IMAGES.put("Double Yolk Country Eggs (6)", "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80");
        PRODUCT_IMAGES.put("Herbal Fed Chicken Eggs (6)", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80");
        PRODUCT_IMAGES.put("Local Village Eggs (12)", "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80");
        PRODUCT_IMAGES.put("Egg White Pack", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80");

        // Honey
        PRODUCT_IMAGES.put("Raw Forest Wild Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Mustard Blossom Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Eucalyptus Pure Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Multiflora Organic Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Sunderban Mangrove Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Comb Fresh Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Acacia Pure Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Ajwain Infused Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Tulsi Medicinal Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");
        PRODUCT_IMAGES.put("Sidr Organic Honey", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80");

        // Flowers
        PRODUCT_IMAGES.put("Fresh Red Roses (Bunch)", "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80");
        PRODUCT_IMAGES.put("Yellow Marigold (Genda)", "https://images.unsplash.com/photo-1508784932257-4b55ac6e5e8e?w=500&q=80");
        PRODUCT_IMAGES.put("Jasmine Garland (Mogra)", "https://images.unsplash.com/photo-1507290439931-a8e023f0a850?w=500&q=80");
        PRODUCT_IMAGES.put("Cut Carnations Mix", "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Tuberose (Rajnigandha)", "https://images.unsplash.com/photo-1508784932257-4b55ac6e5e8e?w=500&q=80");
        PRODUCT_IMAGES.put("Orchid Stems Pink", "https://images.unsplash.com/photo-1507290439931-a8e023f0a850?w=500&q=80");
        PRODUCT_IMAGES.put("Gerbera Daisy Pack", "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80");
        PRODUCT_IMAGES.put("Chrysanthemum Mix", "https://images.unsplash.com/photo-1508784932257-4b55ac6e5e8e?w=500&q=80");
        PRODUCT_IMAGES.put("Lotus Blooms (3)", "https://images.unsplash.com/photo-1507290439931-a8e023f0a850?w=500&q=80");
        PRODUCT_IMAGES.put("Exotic Flower Bouquet", "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80");

        // Herbs
        PRODUCT_IMAGES.put("Fresh Basil Leaves (Tulsi)", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80");
        PRODUCT_IMAGES.put("Rosemary Stems Fresh", "https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=500&q=80");
        PRODUCT_IMAGES.put("Thyme Herbal Sprigs", "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&q=80");
        PRODUCT_IMAGES.put("Oregano Fresh Stems", "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80");
        PRODUCT_IMAGES.put("Lemongrass Stems", "https://images.unsplash.com/photo-1628134714488-66270725a371?w=500&q=80");
        PRODUCT_IMAGES.put("Aloe Vera Fresh Leaves", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Ashwagandha Roots", "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?w=500&q=80");
        PRODUCT_IMAGES.put("Stevia Green Leaves", "https://images.unsplash.com/photo-1622206194165-246f48597a18?w=500&q=80");
        PRODUCT_IMAGES.put("Parsley Italian Bunch", "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80");
        PRODUCT_IMAGES.put("Celery Sticks Fresh", "https://images.unsplash.com/photo-1596701062351-852b727be45b?w=500&q=80");

        // Seeds
        PRODUCT_IMAGES.put("Raw Chia Seeds", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Flax Seeds", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
        PRODUCT_IMAGES.put("Sunflower Seeds Raw", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Pumpkin Seeds Roasted", "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80");
        PRODUCT_IMAGES.put("Watermelon Seeds", "https://images.unsplash.com/photo-1600611422773-cbcfdfb7310d?w=500&q=80");
        PRODUCT_IMAGES.put("Sesame Seeds White (Til)", "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80");
        PRODUCT_IMAGES.put("Black Sesame Seeds", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Quinoa Seeds", "https://images.unsplash.com/photo-1536620711904-8976b92a2a0b?w=500&q=80");
        PRODUCT_IMAGES.put("Mustard Planting Seeds", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80");
        PRODUCT_IMAGES.put("Spinach Vegetable Seeds", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");

        // Organic Products
        PRODUCT_IMAGES.put("Organic Jaggery Powder", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Cold Pressed Coconut Oil", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80");
        PRODUCT_IMAGES.put("Wood Pressed Sesame Oil", "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Rock Salt (Sendha)", "https://images.unsplash.com/photo-1532132644265-5152865c6978?w=500&q=80");
        PRODUCT_IMAGES.put("Raw Coconut Sugar", "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80");
        PRODUCT_IMAGES.put("Wood Pressed Groundnut Oil", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");
        PRODUCT_IMAGES.put("Natural Apple Cider Vinegar", "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Amla Juice", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80");
        PRODUCT_IMAGES.put("Handmade Herbal Soap", "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80");
        PRODUCT_IMAGES.put("Organic Moringa Powder", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80");

        // Fertilizers
        PRODUCT_IMAGES.put("Organic Vermicompost (5kg)", "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80");
        PRODUCT_IMAGES.put("Neem Cake Fertilizer", "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80");
        PRODUCT_IMAGES.put("Bone Meal Organic Soil", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80");
        PRODUCT_IMAGES.put("Bio-Enzyme Plant Booster", "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80");
        PRODUCT_IMAGES.put("Cow Dung Compost (10kg)", "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80");
        PRODUCT_IMAGES.put("Seaweed Liquid Fertilizer", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80");
        PRODUCT_IMAGES.put("Cocopeat Block (5kg)", "https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80");
        PRODUCT_IMAGES.put("Trichoderma Bio-Fungicide", "https://images.unsplash.com/photo-1587570220677-668607a64a38?w=500&q=80");
        PRODUCT_IMAGES.put("Epsom Salt Soil Nutrient", "https://images.unsplash.com/photo-1587334206574-351ecdb77485?w=500&q=80");
        PRODUCT_IMAGES.put("Mycorrhiza Bio-Fertilizer", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80");

        // Plants
        PRODUCT_IMAGES.put("Fresh Tulsi Plant Pot", "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80");
        PRODUCT_IMAGES.put("Aloe Vera Live Plant", "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80");
        PRODUCT_IMAGES.put("Curry Leaf Live Tree", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80");
        PRODUCT_IMAGES.put("Snake Air Purifier Plant", "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80");
        PRODUCT_IMAGES.put("Money Plant Green Pot", "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80");
        PRODUCT_IMAGES.put("Red Rose Bush Live", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80");
        PRODUCT_IMAGES.put("Jasmine Flowering Shrub", "https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80");
        PRODUCT_IMAGES.put("Lemon Plant Grafted", "https://images.unsplash.com/photo-1587570220677-668607a64a38?w=500&q=80");
        PRODUCT_IMAGES.put("Mint Live Herb Pot", "https://images.unsplash.com/photo-1587334206574-351ecdb77485?w=500&q=80");
        PRODUCT_IMAGES.put("Bonsai Ficus Plant", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80");

        // Seasonal Products
        PRODUCT_IMAGES.put("Fresh Sweet Corn Cob", "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80");
        PRODUCT_IMAGES.put("Winter Green Peas Pods", "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80");
        PRODUCT_IMAGES.put("Summer Ice Apples (Tadgola)", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80");
        PRODUCT_IMAGES.put("Monsoon Fresh Jamun", "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80");
        PRODUCT_IMAGES.put("Festive Sugarcane Stems", "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80");
        PRODUCT_IMAGES.put("Spring Strawberry Pack", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80");
        PRODUCT_IMAGES.put("Raw Mango (Kaccha Aam)", "https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80");
        PRODUCT_IMAGES.put("Fresh Water Chestnuts", "https://images.unsplash.com/photo-1587570220677-668607a64a38?w=500&q=80");
        PRODUCT_IMAGES.put("Seasonal Tender Coconut", "https://images.unsplash.com/photo-1587334206574-351ecdb77485?w=500&q=80");
        PRODUCT_IMAGES.put("Custard Apples (Sitaphal)", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80");
    }

    private String getProductImage(String productName) {
        if (productName == null) {
            return "https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?w=500&q=80";
        }
        if (PRODUCT_IMAGES.containsKey(productName)) {
            return PRODUCT_IMAGES.get(productName);
        }
        
        String lower = productName.toLowerCase();
        if (lower.contains("tomato")) return "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80";
        if (lower.contains("capsicum")) return "https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80";
        if (lower.contains("onion")) return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80";
        if (lower.contains("carrot")) return "https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80";
        if (lower.contains("cucumber")) return "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80";
        if (lower.contains("potato")) return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80";
        if (lower.contains("cauliflower")) return "https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80";
        if (lower.contains("pea")) return "https://images.unsplash.com/photo-1587570220677-668607a64a38?w=500&q=80";
        if (lower.contains("beet")) return "https://images.unsplash.com/photo-1587334206574-351ecdb77485?w=500&q=80";
        if (lower.contains("gourd")) return "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80";
        if (lower.contains("mango")) return "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80";
        if (lower.contains("banana")) return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80";
        if (lower.contains("apple")) return "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80";
        if (lower.contains("grape")) return "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80";
        if (lower.contains("papaya")) return "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&q=80";
        if (lower.contains("pomegranate")) return "https://images.unsplash.com/photo-1541348263662-e0c8643c21ec?w=500&q=80";
        if (lower.contains("guava")) return "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80";
        if (lower.contains("orange")) return "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80";
        if (lower.contains("dragon")) return "https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80";
        if (lower.contains("watermelon")) return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80";
        if (lower.contains("spinach")) return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80";
        if (lower.contains("coriander")) return "https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=500&q=80";
        if (lower.contains("mint")) return "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&q=80";
        if (lower.contains("fenugreek")) return "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80";
        if (lower.contains("amaranth")) return "https://images.unsplash.com/photo-1628134714488-66270725a371?w=500&q=80";
        if (lower.contains("curry")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("spring onion")) return "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?w=500&q=80";
        if (lower.contains("lettuce")) return "https://images.unsplash.com/photo-1622206194165-246f48597a18?w=500&q=80";
        if (lower.contains("mustard")) return "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80";
        if (lower.contains("dill")) return "https://images.unsplash.com/photo-1596701062351-852b727be45b?w=500&q=80";
        if (lower.contains("corn")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80";
        if (lower.contains("barley")) return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80";
        if (lower.contains("sorghum")) return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80";
        if (lower.contains("oat")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("rye")) return "https://images.unsplash.com/photo-1600611422773-cbcfdfb7310d?w=500&q=80";
        if (lower.contains("ragi")) return "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80";
        if (lower.contains("millet")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("dal")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80";
        if (lower.contains("chana")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("rajma")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("lobiya")) return "https://images.unsplash.com/photo-1536620711904-8976b92a2a0b?w=500&q=80";
        if (lower.contains("kulthi")) return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80";
        if (lower.contains("rice")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80";
        if (lower.contains("wheat")) return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80";
        if (lower.contains("turmeric")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("chilli")) return "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80";
        if (lower.contains("pepper")) return "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&q=80";
        if (lower.contains("cardamom")) return "https://images.unsplash.com/photo-1532132644265-5152865c6978?w=500&q=80";
        if (lower.contains("cinnamon")) return "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80";
        if (lower.contains("cumin")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("clove")) return "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&q=80";
        if (lower.contains("ginger")) return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80";
        if (lower.contains("almond")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("cashew")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("walnut")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("raisin")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("fig")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("pistachio")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("date")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("blueberr")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("prune")) return "https://images.unsplash.com/photo-1508061253366-f7da158b6d4f?w=500&q=80";
        if (lower.contains("milk")) return "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80";
        if (lower.contains("curd")) return "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80";
        if (lower.contains("ghee")) return "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80";
        if (lower.contains("paneer")) return "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=500&q=80";
        if (lower.contains("butter")) return "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80";
        if (lower.contains("cream")) return "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80";
        if (lower.contains("egg")) return "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80";
        if (lower.contains("honey")) return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80";
        if (lower.contains("rose")) return "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80";
        if (lower.contains("marigold")) return "https://images.unsplash.com/photo-1508784932257-4b55ac6e5e8e?w=500&q=80";
        if (lower.contains("jasmine")) return "https://images.unsplash.com/photo-1507290439931-a8e023f0a850?w=500&q=80";
        if (lower.contains("basil")) return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80";
        if (lower.contains("tulsi")) return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80";
        if (lower.contains("ashwagandha")) return "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?w=500&q=80";
        
        return "https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?w=500&q=80";
    }
}
