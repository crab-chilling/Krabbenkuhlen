package com.cpe.springboot.cardPropertiesService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PropertiesDTO {
    private float hp;
    private float energy;
    private float attack;
    private float defense;
}
