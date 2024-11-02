package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.dto.queues.GenericAsyncTaskDTO;

public interface GenericAsyncTasksService {

    public void proceedReceivedMessage(GenericAsyncTaskDTO genericAsyncTaskDTO);
}
