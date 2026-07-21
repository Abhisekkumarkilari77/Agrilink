package com.agrilink.constant;

public class SecurityConstants {
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String TOKEN_TYPE = "JWT";
    public static final String TOKEN_ISSUER = "agrilink-api";
    public static final String TOKEN_AUDIENCE = "agrilink-app";

    private SecurityConstants() {
        // prevent instantiation
    }
}
