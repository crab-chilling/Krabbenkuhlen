package com.cpe.springboot.message.controller;

import com.cpe.springboot.message.model.MessageModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends CrudRepository<MessageModel, Integer> {

    @Query("SELECT m FROM MessageModel m WHERE m.from.id = :from AND m.to.id = :to")
    List<MessageModel> findMessageModelByFromIdAndToId(@Param("from") int from, @Param("to") int to);

    // find all message in a discussion
    @Query("SELECT m FROM MessageModel m WHERE (m.from.id = :from AND m.to.id = :to) OR (m.from.id = :to AND m.to.id = :from) order by m.date")
    List<MessageModel> findMessageModelByFromIdAndToIdOrToIdAndFromId(@Param("from") int from, @Param("to") int to);
}
