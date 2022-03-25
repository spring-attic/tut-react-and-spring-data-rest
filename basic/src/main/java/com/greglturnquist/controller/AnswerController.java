package com.greglturnquist.controller;


import com.greglturnquist.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class AnswerController {

    @Autowired
    private AnswerRepository answerRepository;

    public AnswerController(AnswerRepository answerRepository){
        this.answerRepository = answerRepository;
    }

}