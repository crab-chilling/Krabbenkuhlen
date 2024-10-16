package com.cpe.springboot.common.tools;
import com.cpe.springboot.card.model.CardModel;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.user.model.UserDTO;
import com.cpe.springboot.user.model.UserModel;

public class DTOMapper {
	
	public static CardDTO fromCardModelToCardDTO(CardModel cM) {
		CardDTO cDto =new CardDTO(cM.getName(), cM.getDescription(), cM.getFamily(), cM.getAffinity(), cM.getImgUrl(), cM.getSmallImgUrl(),
				cM.getId(), cM.getEnergy(), cM.getHp(), cM.getDefence(), cM.getAttack(), cM.getPrice(),
				(cM.getUser() != null) ? cM.getUser().getId() : null);
		return cDto;
	}
	
	public static CardModel fromCardDtoToCardModel(CardDTO cD) {
		CardModel cm=new CardModel(cD);
		cm.setEnergy(cD.getEnergy());
		cm.setHp(cD.getHp());
		cm.setDefence(cD.getDefence());
		cm.setAttack(cD.getAttack());
		cm.setPrice(cD.getPrice());
		cm.setId(cD.getId());
		return cm;
	}
	
	
	public static UserDTO fromUserModelToUserDTO(UserModel uM) {
		UserDTO uDto =new UserDTO(uM);
		return uDto;
	}
	
}
