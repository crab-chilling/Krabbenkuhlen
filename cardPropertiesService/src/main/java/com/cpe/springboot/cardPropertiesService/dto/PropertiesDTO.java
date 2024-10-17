package com.cpe.springboot.cardPropertiesService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class PropertiesDTO implements Serializable {
    private float hp;
    private float energy;
    private float attack;
    private float defense;
}
