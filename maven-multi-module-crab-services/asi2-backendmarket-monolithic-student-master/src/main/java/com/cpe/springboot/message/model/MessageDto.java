package com.cpe.springboot.message.model;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Builder
@Data
public class MessageDto implements Serializable {
    private static final long serialVersionUID = 2733795832476568050L;
    private int from;
    private int to;
    private String message;
    private String date;
}
