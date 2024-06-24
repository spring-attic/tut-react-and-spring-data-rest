package com.greglturnquist.model.form;

import com.greglturnquist.model.Answer;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
public class Question {

    //unique id for each Question
    @Id
    private UUID id;

    //Question text
    private String value;

    //List of survey answers for question
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "question")
    private List<Answer> answerList;


    //Form the question is associated with
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "form_id")
    private Form form;

    /**
     * Default constructor for Question.
     */
    public Question() {
        this("What is your name?");
    }

    /**
     * Create Question with specified string as the question.
     * @param value String containing the contents of the question.
     */
    public Question(String value) {
        this.value = value;
        this.id = UUID.randomUUID();
        this.answerList = new ArrayList<>();
    }


    /**
     * Set id of Question.
     * @param id UUID which the id will be set to.
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * Set question text.
     * @param value New question text.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Add answer to list.
     * @param answer Answer to be added to List.
     */
    public void addAnswerList(Answer answer){
        answer.setQuestion(this);
        this.answerList.add(answer);
    }

    /**
     * Get Answers for this Question.
     * @return a List containing the Answers for this Question.
     */
    public List<Answer> getAnswerList() {
        return answerList;
    }

    /**
     * Get id of Question.
     * @return UUID of Question.
     */
    public UUID getId() {
        return this.id;
    }

    /**
     * Gets question string.
     * @return String containing question text.
     */
    public String getValue() {
        return this.value;
    }

    /**
     * Gets Form associated with Question.
     * @return Form associated with Question.
     */
    public Form getForm() {
        return form;
    }

    /**
     * Set the Form which is associated with this Question.
     * @param form The Form which holds this question.
     */
    public void setForm(Form form) {
        this.form = form;
    }

    @Override
    public String toString() {
        return this.value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (getClass() != o.getClass())
            return false;
        Question other = (Question) o;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (value == null) {
            return other.value == null;
        } else return value.equals(other.value);
    }

    /**
     * Serial representation of Question class.
     * @return Serial representation of Question class.
     */
    public String serialize() {
        return value;
    }
}