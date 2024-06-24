package com.greglturnquist.controller;

import com.greglturnquist.model.form.Form;
import com.greglturnquist.model.form.Question;
import com.greglturnquist.repository.FormRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class WebController {

    private final FormRepository repository;

    public WebController(FormRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/form")
    public Form createForm(@RequestBody(required = false) List<Question> questionList) {
        Form a = new Form();
        if(questionList != null) {
            for(Question b : questionList) {
                a.addQuestion(b);
            }
        }
        repository.save(a);

        return a;
    }

    @GetMapping("/form/{id}")
    public Form getForm(@PathVariable String id) {
        Optional<Form> response = repository.findById(UUID.fromString(id));
        return response.orElse(null);
    }

    @GetMapping("/form")
    public Form getAllForms() {
        Iterable<Form> response = repository.findAll();
        List<Form> temp = new ArrayList<Form>();
        for (Form f : response) {
            temp.add(f);
        }
        //returning first index just for the first milestone
        return temp.get(0);
    }

    @PostMapping("/form/{id}")
    public PrimitiveResponse<Boolean> createQuestion(@PathVariable String id, @RequestBody Question question) {
        Optional<Form> response = repository.findById(UUID.fromString(id));
        if(response.isEmpty()) {
            return new PrimitiveResponse<>("success", false);
        }
        Form book = response.get();
        book.addQuestion(question);
        repository.save(book);
        return new PrimitiveResponse<>("success", true);
    }

    @DeleteMapping("/form/{id}/question/{questionId}")
    public PrimitiveResponse<Boolean> deleteQuestion(@PathVariable String id, @PathVariable String questionId) {
        Optional<Form> response = repository.findById(UUID.fromString(id));
        if(response.isEmpty()) {
            return new PrimitiveResponse<>("success", false);
        }
        Form book = response.get();
        if(book.removeQuestion(UUID.fromString(questionId))) {
            repository.save(book);
            return new PrimitiveResponse<>("success", true);
        }
        return new PrimitiveResponse<>("success", false);
    }

}


class PrimitiveResponse<T> {

    private final Map<String, T> body;

    public PrimitiveResponse(String key, T value) {
        this.body = new HashMap<>(1);
        this.body.put(key, value);
    }

    public Map<String, T> getBody() {
        return this.body;
    }
}