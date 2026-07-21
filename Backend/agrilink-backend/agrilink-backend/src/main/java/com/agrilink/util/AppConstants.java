package com.agrilink.util;

public class AppConstants {
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIR = "desc";

    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 5;

    public static final double DEFAULT_DELIVERY_CHARGE = 40.0;
    public static final double DEFAULT_COMMISSION_PERCENT = 15.0;
    public static final double DEFAULT_GST_PERCENT = 5.0;
    public static final double DEFAULT_MAX_DELIVERY_RADIUS_KM = 15.0;

    private AppConstants() {
        // prevent instantiation
    }
}
