package com.cpe.springboot.card.Controller;

import java.util.*;

import com.cpe.springboot.common.tools.DTOMapper;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cpe.springboot.card.model.CardModel;
import com.cpe.springboot.card.model.CardReference;
import org.springframework.web.reactive.function.client.WebClient;

import static com.cpe.springboot.common.Constants.ENDPOINT_GENERATE_CARD;

@Service
public class CardModelService {
	private final CardModelRepository cardRepository;
	private final CardReferenceService cardRefService;
	private final Random rand;

	public CardModelService(CardModelRepository cardRepository,
							CardReferenceService cardRefService) {
		this.rand=new Random();
		this.cardRepository=cardRepository;
		this.cardRefService=cardRefService;
	}
	
	public List<CardModel> getAllCardModel() {
		List<CardModel> cardList = new ArrayList<>();
		cardRepository.findAll().forEach(cardList::add);
		return cardList;
	}

	public CardDTO addCard(CardModel cardModel) {
		CardModel cDb=cardRepository.save(cardModel);
		return DTOMapper.fromCardModelToCardDTO(cDb);
	}

	public void updateCardRef(CardModel cardModel) {
		cardRepository.save(cardModel);

	}
	public CardDTO updateCard(CardModel cardModel) {
		CardModel cDb=cardRepository.save(cardModel);
		return DTOMapper.fromCardModelToCardDTO(cDb);
	}
	public Optional<CardModel> getCard(Integer id) {
		return cardRepository.findById(id);
	}
	
	public void deleteCardModel(Integer id) {
		cardRepository.deleteById(id);
	}
	
	public List<CardModel> getRandCard(int nbr){
		List<CardModel> cardList=new ArrayList<>();
		for(int i=0;i<nbr;i++) {
			CardReference currentCardRef=cardRefService.getRandCardRef();
			CardModel currentCard=new CardModel(currentCardRef);
			currentCard.setAttack(rand.nextFloat()*100);
			currentCard.setDefence(rand.nextFloat()*100);
			currentCard.setEnergy(100);
			currentCard.setHp(rand.nextFloat()*100);
			currentCard.setPrice(currentCard.computePrice());
			//save new card before sending for user creation
			//this.addCard(currentCard);
			cardList.add(currentCard);
		}
		return cardList;
	}


	public List<CardModel> getAllCardToSell(){
		return this.cardRepository.findByUser(null);
	}

	public HttpStatus generateCard(CardGeneratorTransactionDTO cardGeneratorTransactionDTO) {
		return Objects.requireNonNull(WebClient.builder().build()
                        .post()
                        .uri(ENDPOINT_GENERATE_CARD)
                        .bodyValue(cardGeneratorTransactionDTO)
                        .retrieve()
                        .toBodilessEntity()
                        .block())
				.getStatusCode().isError() ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK;
	}
}

