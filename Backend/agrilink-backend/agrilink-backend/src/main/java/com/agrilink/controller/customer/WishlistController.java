package com.agrilink.controller.customer;

import com.agrilink.entity.customer.Wishlist;
import com.agrilink.entity.product.Product;
import com.agrilink.repository.ProductRepository;
import com.agrilink.repository.WishlistRepository;
import com.agrilink.response.ApiResponse;
import com.agrilink.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/customer/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    private String getUserId(String requestedUserId) {
        if (requestedUserId != null && !requestedUserId.isEmpty()) {
            return requestedUserId;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }
        return "guest";
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getWishlistProducts(@RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        Wishlist wishlist = wishlistRepository.findByUserId(uid).orElse(Wishlist.builder().userId(uid).productIds(new ArrayList<>()).build());
        List<Product> products = productRepository.findAllById(wishlist.getProductIds());
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved successfully", products));
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResponse<List<String>>> getWishlistProductIds(@RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        Wishlist wishlist = wishlistRepository.findByUserId(uid).orElse(Wishlist.builder().userId(uid).productIds(new ArrayList<>()).build());
        return ResponseEntity.ok(ApiResponse.success("Wishlist IDs retrieved successfully", wishlist.getProductIds()));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> toggleWishlist(@PathVariable String productId, @RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        Wishlist wishlist = wishlistRepository.findByUserId(uid).orElseGet(() -> Wishlist.builder().userId(uid).productIds(new ArrayList<>()).build());
        if (wishlist.getProductIds().contains(productId)) {
            wishlist.getProductIds().remove(productId);
        } else {
            wishlist.getProductIds().add(productId);
        }
        Wishlist saved = wishlistRepository.save(wishlist);
        return ResponseEntity.ok(ApiResponse.success("Wishlist updated", saved));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> removeFromWishlist(@PathVariable String productId, @RequestParam(required = false) String userId) {
        String uid = getUserId(userId);
        Wishlist wishlist = wishlistRepository.findByUserId(uid).orElseGet(() -> Wishlist.builder().userId(uid).productIds(new ArrayList<>()).build());
        wishlist.getProductIds().remove(productId);
        Wishlist saved = wishlistRepository.save(wishlist);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", saved));
    }
}
