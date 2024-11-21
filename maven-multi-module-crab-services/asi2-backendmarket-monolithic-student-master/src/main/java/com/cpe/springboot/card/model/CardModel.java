package com.cpe.springboot.card.model;

import com.cpe.springboot.dto.CardBasics;
import com.cpe.springboot.store.model.StoreTransaction;
import com.cpe.springboot.user.model.UserModel;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
public class CardModel extends CardBasics {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private float energy;
	private float hp;
	private float defence;
	private float attack;
	private float price;

	@ManyToOne
	@JoinColumn
	private UserModel user;

	@ManyToOne
	@JoinColumn
	private StoreTransaction store;

	public CardModel() {
		super();
	}
	
	public CardModel( CardModel cModel) {
		super(cModel);
		this.energy=cModel.getEnergy();
		this.hp=cModel.getHp();
		this.defence=cModel.getDefence();
		this.attack=cModel.getAttack();
		this.price=cModel.getPrice();
	}

	public CardModel( CardBasics cardBasic) {
		super(cardBasic);
	}

	public CardModel(String name, String description, String family, String affinity, float energy, float hp,
					 float defence, float attack,String imgUrl,String smallImg,float price) {
		super(name, description, family, affinity,imgUrl,smallImg);
		this.energy = energy;
		this.hp = hp;
		this.defence = defence;
		this.attack = attack;
		//this.price=price;
		this.price=this.computePrice();
	}

    public float computePrice() {
		return this.hp * 20 + this.defence*20 + this.energy*20 + this.attack*20;
	}

}
