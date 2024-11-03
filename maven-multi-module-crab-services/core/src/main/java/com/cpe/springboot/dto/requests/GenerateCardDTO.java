package com.cpe.springboot.dto.requests;

public class GenerateCardDTO {

    private String imagePrompt;

    private String descPrompt;

    public GenerateCardDTO(String imagePrompt, String descPrompt) {
        this.imagePrompt = imagePrompt;
        this.descPrompt = descPrompt;
    }

    public String getImagePrompt() {
        return imagePrompt;
    }

    public void setImagePrompt(String imagePrompt) {
        this.imagePrompt = imagePrompt;
    }

    public String getDescPrompt() {
        return descPrompt;
    }

    public void setDescPrompt(String descPrompt) {
        this.descPrompt = descPrompt;
    }
}
