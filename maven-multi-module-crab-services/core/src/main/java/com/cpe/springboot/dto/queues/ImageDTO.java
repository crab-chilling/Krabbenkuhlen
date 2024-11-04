package com.cpe.springboot.dto.queues;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.ToString;

@ToString
public class ImageDTO extends GenericMQDTO {

    @JsonProperty("imgUrl")
    private String imgUrl;

    @JsonProperty("isBase64")
    private boolean isBase64;

    public ImageDTO(Integer transactionId, String imgUrl, boolean isBase64) {
        super(transactionId);
        this.imgUrl = imgUrl;
        this.isBase64 = isBase64;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public boolean isBase64() {
        return isBase64;
    }

    public void setBase64(boolean base64) {
        isBase64 = base64;
    }
}
