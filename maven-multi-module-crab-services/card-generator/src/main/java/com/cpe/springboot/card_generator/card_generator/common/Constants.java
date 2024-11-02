package com.cpe.springboot.card_generator.card_generator.common;

public class Constants {

    public static final String URL_ASYNC_WORKER_SERVICE = "http://localhost:8081";

    public static final String ENDPOINT_ASYNC_WORKER_IMAGE = "/generate";

    public static final String ENDPOINT_ASYNC_WORKER_DESCRIPTION = "/generateDescription";

    public static final String URL_PROPERTIES_SERVICE = "http://localhost:8080";

    public static final String ACTIVEMQ_QUEUE_TASK = "tasks";

    public static final String ACTIVEMQ_QUEUE_CREATED_CARD = "createdcard";
}
