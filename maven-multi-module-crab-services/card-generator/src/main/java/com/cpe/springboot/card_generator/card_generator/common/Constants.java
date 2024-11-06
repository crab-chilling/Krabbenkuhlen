package com.cpe.springboot.card_generator.card_generator.common;

public class Constants {

    public static final String URL_ASYNC_WORKER_SERVICE = "http://localhost:8081";

    public static final String ENDPOINT_ASYNC_WORKER_IMAGE = "/image";

    public static final String ENDPOINT_ASYNC_WORKER_DESCRIPTION = "/prompt";

    public static final String URL_PROPERTIES_SERVICE = "http://localhost:8085";

    public static final String ENDPOINT_PROPERTIES = "/properties";

    public static final String ACTIVEMQ_QUEUE_TASK = "tasks";

    public static final String ACTIVEMQ_QUEUE_CREATED_CARD = "createdcard";

    public static final float CARD_DEFAULT_PRICE = 50f;
}
