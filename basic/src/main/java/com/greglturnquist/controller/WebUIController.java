package com.greglturnquist.controller;

import com.greglturnquist.model.Answer;
import com.greglturnquist.model.form.Form;
import com.greglturnquist.model.form.Question;
import com.greglturnquist.model.form.data.AnswerAndQuestion;
import com.greglturnquist.model.form.data.DataForm;
import com.greglturnquist.model.form.data.QuestionForm;
import com.greglturnquist.repository.FormRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Controller
public class WebUIController {

    private final FormRepository repository;
    private static boolean closed = true;

    public static String decodeValue(String value) {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException ex) {
            throw new RuntimeException(ex.getCause());
        }
    }

    public WebUIController(FormRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/ui")
    public String selectForm(Model model) {
        model.addAttribute("dataForm", new DataForm());
        return "dataForm";
    }

    @PostMapping("/ui")
    public String getForm(@ModelAttribute DataForm dataForm, Model model) {
        Optional<Form> result = repository.findById(UUID.fromString(dataForm.getContent()));

        model.addAttribute("Form", result.orElse(null));
        return "result";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        Form form = new Form();
        repository.save(form);

        model.addAttribute("Form", form);
        return "result";
    }
    @PostMapping(value = "/submission")
    public String submitForm(@RequestBody String body) throws JsonProcessingException {
        System.out.println(body);
        String decodedValue = decodeValue(body);
        decodedValue = decodedValue.substring(0, decodedValue.length() - 1);
        System.out.println(decodedValue);
        List<String> answerList = Arrays.asList(decodedValue.split(","));
        for(String s : answerList){
            System.out.println(s);
        }
        System.out.println(answerList);
        Iterable<Form> response = repository.findAll();
        List<Form> temp = new ArrayList<Form>();
        for (Form f : response) {
            temp.add(f);
        }
        Form f = temp.get(0);
//

        List<Question> questionList = f.getQuestions();
//        for(Question q: questionList){
//            System.out.println(q);
//            Answer answer = new Answer("hey");
//            q.addAnswerList(answer);
//            answer.setQuestion(q);
//        }
        for(int i = 0; i < questionList.size(); i++){
            Answer answer = new Answer(answerList.get(i));
            questionList.get(i).addAnswerList(answer);
            answer.setQuestion(questionList.get(i));
        }
        repository.save(f);
        return "Thanks";
    }

    @GetMapping("/question")
    public String inputQuestionData(Model model) {
        model.addAttribute("questionForm", new QuestionForm());
        return "question";
    }

    @PostMapping("/question")
    public String createQuestionInfo(@ModelAttribute QuestionForm questionForm, Model model) {
        Optional<Form> result = repository.findById(UUID.fromString(questionForm.getId()));

        result.ifPresent(form -> {
            form.addQuestion(new Question(questionForm.getValue()));
            repository.save(form);
        });

        model.addAttribute("questionForm", result.get());

        return "result";
    }

    @GetMapping("/admin")
    public String displayAdmin() {
        return "admin";
    }


    @GetMapping("/survey")
    public String displaySurvey(Model model) {
        if (closed != true){
            return closeForm(model);
        }
        model.addAttribute("closed", closed);
        return "survey";
    }

    @GetMapping("/survey2")
    public String displaySurvey2(Model model) {
//        AnswerList answerList = new AnswerList();
//        answerList.setQuestion("hello");
        List<AnswerAndQuestion> answerList = new ArrayList<>();
        Form form = new Form();
        form.addQuestion(new Question());
        form.addQuestion(new Question("what day is it?"));
        form.addQuestion(new Question("Do you enjoy sports?"));
        List<Question> questionList = form.getQuestions();
        for(Question question : questionList){
            AnswerAndQuestion answer = new AnswerAndQuestion();
            answer.setQuestion(question.getValue());
            answerList.add(answer);
        }
//        model.addAttribute("Form", form);
        model.addAttribute("answerList", answerList);

        return "survey2";
    }


    @GetMapping("/controlPanel")
    public String displayControlPanel() {
        return "controlPanel";
    }

    @GetMapping("/closeForm")
    public String closeForm(Model model) {
        this.closed = false;
//        Iterable<Form> response = repository.findAll();
//        List<Form> temp = new ArrayList<Form>();
//        for (Form f : response) {
//            temp.add(f);
//        }
//        Form form = temp.get(0);
//        List<Question> questionList = form.getQuestions();
//        model.addAttribute("questions", questionList);
        return "answerResults";
    }

}