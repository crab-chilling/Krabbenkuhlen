package com.cpe.springboot.dto.queues;

public class DescriptionDTO extends GenericAsyncTaskDTO {

    private String description;

    public DescriptionDTO(Integer transactionId, String description) {
        super(transactionId);
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
