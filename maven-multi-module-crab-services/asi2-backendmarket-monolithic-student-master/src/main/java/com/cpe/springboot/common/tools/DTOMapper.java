package com.cpe.springboot.common.tools;
import com.cpe.springboot.card.model.CardModel;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.message.model.MessageDto;
import com.cpe.springboot.message.model.MessageModel;
import com.cpe.springboot.user.model.UserDTO;
import com.cpe.springboot.user.model.UserModel;
import org.apache.catalina.User;

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

	public static MessageDto fromMessageModel(MessageModel messageModel) {
		return MessageDto.builder()
				.date(messageModel.getDate())
				.from(messageModel.getFrom().getId())
				.to(messageModel.getTo().getId())
				.message(messageModel.getMessage())
				.build();
	}

	public static MessageModel fromMessageDto(MessageDto messageDto) {
		return MessageModel.builder()
				.date(messageDto.getDate())
				.from(new UserModel(messageDto.getFrom()))
				.to(new UserModel(messageDto.getTo()))
				.message(messageDto.getMessage())
				.build();
	}
	
}
