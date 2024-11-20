package com.cpe.springboot.message.controller;

import com.cpe.springboot.common.tools.DTOMapper;
import com.cpe.springboot.message.model.MessageDto;
import com.cpe.springboot.message.model.MessageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;


    @GetMapping("/message")
    public List<MessageDto> getMessage(@RequestParam("from")int from, @RequestParam("to")int to){

        return messageRepository.findMessageModelByFromIdAndToIdOrToIdAndFromId(from, to)
                .stream()
                .map(DTOMapper::fromMessageModel)
                .collect(Collectors.toList());
    }

    @PostMapping("/message")
    public MessageDto addMessage(@RequestBody MessageDto messageDto){
        return DTOMapper.fromMessageModel(
                messageRepository.save(DTOMapper.fromMessageDto(messageDto))
        );
    }
}
