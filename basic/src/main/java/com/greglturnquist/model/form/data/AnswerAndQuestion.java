package com.greglturnquist.model.form.data;

public class AnswerAndQuestion {


    private String content;

    private String question;

    public String getQuestion(){
        return this.question;
    }

    public String getContent() {
        return this.content;
    }

    public void setQuestion(String question){
        this.question = question;
    }

    public void setContent(String content){
        this.content = content;
    }


    //loop thru list
    //call current form,
    //check if currentForm == to current question
    //if so, update that questions answer.
    //store form back in repo

}

