package com.cpe.springboot.activemq;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class ActiveMQListener implements Runnable {

    @Override
    public void run() {
        performAction();
    }

    public abstract void performAction();
}
