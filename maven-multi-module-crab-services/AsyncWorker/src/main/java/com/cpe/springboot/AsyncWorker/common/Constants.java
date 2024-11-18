package com.cpe.springboot.AsyncWorker.common;

public class Constants {

    // ActiveMQ Configuration

    public static final String ACTIVEMQ_QUEUE_ASYNCWORKER_WORKFLOW = "asyncworker";

    // API Configuration

    public static final String URL_IMAGE_GENERATOR = "http://localhost:8080";

    public static final String ENDPOINT_GENERATE_IMAGE = URL_IMAGE_GENERATOR + "/fake/prompt/req";

    public static final String URL_TEXT_GENERATOR = "http://localhost:11434";

    public static final String ENDPOINT_GENERATE_DESCRIPTION = URL_TEXT_GENERATOR + "/api/generate";
}
