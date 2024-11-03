package com.cpe.springboot.dto.queues;

public class ImageDTO extends GenericMQDTO {

    private String imgUrl;

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
