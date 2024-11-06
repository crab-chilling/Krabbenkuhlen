package com.cpe.springboot.card.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card.listener.TaskListener;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.dto.queues.CreatedCardDTO;
import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;
import com.cpe.springboot.dto.requests.EmailTransactionDTO;
import com.cpe.springboot.user.controller.UserRepository;
import com.cpe.springboot.user.model.UserModel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.http.HttpStatus;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import com.cpe.springboot.card.model.CardModel;
import com.cpe.springboot.card.model.CardReference;
import com.cpe.springboot.common.tools.DTOMapper;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CardModelService {
	private final CardModelRepository cardRepository;
	private final UserRepository userRepository;
	private final CardReferenceService cardRefService;
	private final JmsTemplate jmsTemplate;
	private Random rand;
	private WebClient.Builder webClientBuilder;
	private ObjectMapper objectMapper;
	private ActiveMQ activeMQ;
	private TaskListener taskListener;

	private final static String URL_CARD_GENERATOR = "http://localhost:8082";
	private final static String ENDPOINT_GENERATE_CARD = "/generate";
	private final static String ACTIVEMQ_QUEUE_CREATED_CARD = "createdcard";
	private final static String URL_NOTIFICATION_SERVICE = "http://localhost:8091";
	private final static String ENDPOINT_SEND_EMAIL = "/send/mail";

	public CardModelService(UserRepository userRepository, CardModelRepository cardRepository,
							CardReferenceService cardRefService, JmsTemplate jmsTemplate, TaskListener taskListener) {
		this.rand=new Random();
		this.userRepository = userRepository;// Dependencies injection by constructor
		this.cardRepository=cardRepository;
		this.cardRefService=cardRefService;
		this.jmsTemplate = jmsTemplate;
		this.objectMapper = objectMapper;
		this.activeMQ = activeMQ;
		this.taskListener =  taskListener;
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
		return WebClient.builder().build()
				.post()
				.uri(URL_CARD_GENERATOR + ENDPOINT_GENERATE_CARD)
				.bodyValue(cardGeneratorTransactionDTO)
				.retrieve()
				.toBodilessEntity()
				.block()
				.getStatusCode().isError() ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK;
	}

	@JmsListener(destination = "createdcard", containerFactory = "queueConnectionFactory")
	public void proceedGeneratedCardMessage(TextMessage message) throws JMSException, JsonProcessingException, ClassNotFoundException {
		taskListener.doReceive(message, null);
	}
}

