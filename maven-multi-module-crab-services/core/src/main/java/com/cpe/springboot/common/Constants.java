package com.cpe.springboot.common;

public class Constants {

    // ActiveMQ configuration

    public static final String ACTIVEMQ_QUEUE_TASK = "tasks";

    public static final String ACTIVEMQ_QUEUE_CREATED_CARD = "createdcard";

    // API configuration

    public static final String URL_ASYNC_WORKER_SERVICE = "http://localhost:8081";

    public static final String ENDPOINT_ASYNC_WORKER_IMAGE = URL_ASYNC_WORKER_SERVICE + "/image";

    public static final String ENDPOINT_ASYNC_WORKER_DESCRIPTION = URL_ASYNC_WORKER_SERVICE + "/prompt";

    public static final String URL_PROPERTIES_SERVICE = "http://localhost:8085";

    public static final String ENDPOINT_PROPERTIES = URL_PROPERTIES_SERVICE + "/properties";

    public final static String URL_CARD_GENERATOR = "http://localhost:8082";

    public final static String ENDPOINT_GENERATE_CARD = URL_CARD_GENERATOR + "/generate";

    public final static String URL_NOTIFICATION_SERVICE = "http://localhost:8091";

    public final static String ENDPOINT_SEND_EMAIL = URL_NOTIFICATION_SERVICE + "/send/mail";

    // Other constants

    public static final float CARD_DEFAULT_PRICE = 50f;
}
