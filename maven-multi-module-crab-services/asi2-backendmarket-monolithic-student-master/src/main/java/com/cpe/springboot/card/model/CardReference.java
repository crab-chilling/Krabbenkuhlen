package com.cpe.springboot.card.model;

import com.cpe.springboot.dto.CardBasics;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@Entity
public class CardReference extends CardBasics implements Serializable {

	@Serial
	private static final long serialVersionUID = -7059808842444736266L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	public CardReference() {
	}

	public CardReference(String name, String description, String family, String affinity,String imgUrl,String smallImgUrl) {
		super(name, description, family,affinity,imgUrl,smallImgUrl);
	}

}
