package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.dto.CardDTO;
import org.springframework.stereotype.Service;
import com.cpe.springboot.dto.CardRequestDTO;
import com.cpe.springboot.dto.CardRequestDTO;


@Service
public class CardGeneratorService {

        public void generateCard(CardRequestDTO cardRequestDTO) {
            CardDTO cardDTO = new CardDTO();

            cardDTO.setHp(cardRequestDTO.getHp());
            cardDTO.setEnergy(cardRequestDTO.getEnergy());
            cardDTO.setAttack(cardRequestDTO.getAttack());
            cardDTO.setDefence(cardRequestDTO.getDefense());

            cardDTO.setPrice(999);//Où on récup le prix ?

            cardDTO.setUserId(999);//A changer quand on le récup dans le body de la requete

            cardDTO.setImgUrl(cardRequestDTO.getBase64Image());

            cardDTO.setId(null);//ID pas encore géré ?

            publishCardToQueue(CardDTO);//A implementer

            System.out.println("Card generated :" + cardDTO);
        }
}
