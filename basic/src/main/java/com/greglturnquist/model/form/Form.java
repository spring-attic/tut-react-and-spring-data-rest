package com.greglturnquist.model.form;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;


@Entity
public class Form {

    // unique id for each From
    @Id
    private UUID id;

    // One to many relationship with questions
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "form")
    private List<Question> questions;

    /**
     *   Initialize id and questions arraylist to create a Form which will hold questions
     */

    public Form() {
        this.id = UUID.randomUUID();
        questions = new ArrayList<>();
    }

    /**
     * Add question to form.
     * @param question Question to be added to Form.
     */
    public void addQuestion(Question question) {
        question.setForm(this);
        this.questions.add(question);
    }


    /**
     * Get id of Form.
     * @return UUID representation of id of Form.
     */
    public UUID getId() {
        return id;
    }

    /**
     * Set id of Form
     * @param id UUID which the Form id will be set to.
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * Gets all the Questions of the Form.
     * @return A List containing the Questions of the Form.
     */
    @OneToMany(mappedBy = "form")
    public List<Question> getQuestions() {
        return this.questions;
    }

    /**
     * Set the List of Questions the Form has.
     * @param questions The List of Questions the Form will have.
     */
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    /**
     * Remove Question based of index.
     * @param index The index of the Question to be removed.
     */
    public void removeQuestion(int index) {
        questions.remove(index);
    }


    /**
     * Remove Question based off UUID.
     * @param id UUID of Question be removed.
     * @return a boolean representing whether the specified Question was removed.
     */
    public boolean removeQuestion(UUID id) {
        for(int i = 0; i < questions.size(); i++) {
            if(questions.get(i).getId().equals(id)) {
                removeQuestion(i);
                return true;
            }
        }
        return false;
    }


    @Override
    public String toString() {
        StringJoiner j = new StringJoiner("\n");

        for(Question question : questions) {
            j.add(question.toString());
        }

        return j.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        if (getClass() != o.getClass())
            return false;
        Form other = (Form) o;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (questions == null) {
            return other.questions == null;
        } else return questions.equals(other.questions);
    }


    /**
     * Serial representation of Form class.
     * @return Serial representation of Form class.
     */
    public String serialize() {
        StringJoiner b = new StringJoiner(",",
                "{" +
                        "\"data\": [" +
                        "\"type\": \"form\"" +
                        "\"id\": " + this.id +
                        "\"attributes\": {[",
                "]}]}");
        for(Question question : questions) {
            b.add(question.serialize());
        }
        return b.toString();
    }
}