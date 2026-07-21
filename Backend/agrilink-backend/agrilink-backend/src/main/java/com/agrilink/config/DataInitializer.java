package com.agrilink.config;

import com.agrilink.entity.auth.User;
import com.agrilink.entity.product.Category;
import com.agrilink.entity.product.Product;
import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import com.agrilink.repository.CategoryRepository;
import com.agrilink.repository.ProductRepository;
import com.agrilink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Admin user if not present
        if (!userRepository.existsByEmail("admin@agrilink.com")) {
            User admin = User.builder()
                    .name("AgriLink Admin")
                    .email("admin@agrilink.com")
                    .mobile("9000000001")
                    .password(passwordEncoder.encode("admin123"))
                    .role(RoleType.ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            System.out.println("Default Admin user created: admin@agrilink.com / admin123");
        }

        // 2. Create Super Admin user if not present
        if (!userRepository.existsByEmail("superadmin@agrilink.com")) {
            User superAdmin = User.builder()
                    .name("System Super Admin")
                    .email("superadmin@agrilink.com")
                    .mobile("9000000000")
                    .password(passwordEncoder.encode("superadmin123"))
                    .role(RoleType.SUPER_ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(superAdmin);
            System.out.println("Default Super Admin user created: superadmin@agrilink.com / superadmin123");
        }

        // 3. Create Sample Farmer user if not present
        User farmer = userRepository.findByEmail("farmer@agrilink.com").orElse(null);
        if (farmer == null) {
            farmer = User.builder()
                    .name("Rajesh Kumar")
                    .email("farmer@agrilink.com")
                    .mobile("9876543211")
                    .password(passwordEncoder.encode("farmer123"))
                    .role(RoleType.FARMER)
                    .status(AccountStatus.ACTIVE)
                    .farmName("Rajesh Organic Farm")
                    .aadhaarNumber("123456789012")
                    .build();
            farmer = userRepository.save(farmer);
            System.out.println("Default Farmer user created: farmer@agrilink.com / farmer123");
        }

        // 4. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    Category.builder().name("Vegetables").description("Fresh chemical-free farm vegetables").build(),
                    Category.builder().name("Fruits").description("Naturally ripened organic fruits").build(),
                    Category.builder().name("Dairy").description("Pure unadulterated farm fresh dairy").build(),
                    Category.builder().name("Grains").description("Organically harvested grains & pulses").build(),
                    Category.builder().name("Flowers").description("Freshly cut decorative farm flowers").build(),
                    Category.builder().name("Eggs").description("Free-range country eggs").build()
            );
            categoryRepository.saveAll(categories);
            System.out.println("Sample Categories seeded into MongoDB");
        }

        // 5. Seed Sample Products if empty
        if (productRepository.count() == 0) {
            String farmerId = farmer.getId();
            List<Product> sampleProducts = Arrays.asList(
                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Organic Tomatoes")
                            .category("Vegetables")
                            .price(35.0)
                            .quantity(150)
                            .organic(true)
                            .rating(4.8)
                            .distance(4.2)
                            .harvestDate("2026-07-18")
                            .freshness("High")
                            .description("Freshly harvested vine-ripened organic tomatoes. Chemical-free and delicious.")
                            .image("https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&q=80")
                            .status("Available")
                            .ordersReceived(14)
                            .build(),

                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Fresh Alphonso Mangoes")
                            .category("Fruits")
                            .price(180.0)
                            .quantity(60)
                            .organic(true)
                            .rating(4.9)
                            .distance(8.5)
                            .harvestDate("2026-07-19")
                            .freshness("Excellent")
                            .description("Juicy, naturally ripened Alphonso mangoes directly from the orchard.")
                            .image("https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80")
                            .status("Available")
                            .ordersReceived(22)
                            .build(),

                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Pure Cow Milk")
                            .category("Dairy")
                            .price(60.0)
                            .quantity(80)
                            .organic(false)
                            .rating(4.6)
                            .distance(4.2)
                            .harvestDate("2026-07-20")
                            .freshness("High")
                            .description("Fresh, pasteurized pure cow milk, unadulterated and full of nutrients.")
                            .image("https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80")
                            .status("Available")
                            .ordersReceived(30)
                            .build(),

                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Premium Basmati Rice")
                            .category("Grains")
                            .price(95.0)
                            .quantity(500)
                            .organic(true)
                            .rating(4.7)
                            .distance(8.5)
                            .harvestDate("2026-06-15")
                            .freshness("High")
                            .description("Aged long-grain aromatic Basmati rice, harvested organically.")
                            .image("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80")
                            .status("Available")
                            .ordersReceived(8)
                            .build(),

                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Fresh Red Roses")
                            .category("Flowers")
                            .price(15.0)
                            .quantity(200)
                            .organic(false)
                            .rating(4.5)
                            .distance(4.2)
                            .harvestDate("2026-07-20")
                            .freshness("High")
                            .description("Freshly cut long-stemmed red roses, perfect for decorations or gifts.")
                            .image("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80")
                            .status("Available")
                            .ordersReceived(5)
                            .build(),

                    Product.builder()
                            .farmerId(farmerId)
                            .farmerName("Rajesh Kumar")
                            .farmName("Rajesh Organic Farm")
                            .name("Country Eggs (Pack of 6)")
                            .category("Eggs")
                            .price(48.0)
                            .quantity(100)
                            .organic(true)
                            .rating(4.8)
                            .distance(8.5)
                            .harvestDate("2026-07-20")
                            .freshness("High")
                            .description("Nutritious free-range country eggs from organically fed poultry.")
                            .image("https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=400&q=80")
                            .status("Available")
                            .ordersReceived(19)
                            .build()
            );

            productRepository.saveAll(sampleProducts);
            System.out.println("Sample Products seeded into MongoDB");
        }
    }
}
