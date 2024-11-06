package com.cpe.springboot.dto.queues;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DescriptionDTO extends GenericMQDTO {

    @JsonProperty("description")
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
