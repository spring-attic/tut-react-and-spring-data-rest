package com.greglturnquist.model;

import com.greglturnquist.model.form.Question;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Answer {

    @Id
    @GeneratedValue
    private UUID id;

    private String answer;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    public Answer() {
    }

    public Answer(String answer) {
        this.answer = answer;
    }

    public UUID getId() {
        return id;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public void setQuestion(Question question){
        this.question = question;
    }

    public Question getQuestion(){
        return question;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (getClass() != o.getClass())
            return false;
        Answer other = (Answer) o;
        if (answer == null) {
            return other.answer == null;
        } else return answer.equals(other.answer);
    }

    public String serialize() {
        return answer;
    }

}