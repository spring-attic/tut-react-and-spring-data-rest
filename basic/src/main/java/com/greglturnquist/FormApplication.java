package com.greglturnquist;

import com.greglturnquist.model.form.Form;
import com.greglturnquist.model.form.Question;
import com.greglturnquist.repository.FormRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FormApplication {

    private static final Logger log = LoggerFactory.getLogger(FormApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(FormApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(FormRepository repository) {
        return (args) -> {
            Form form = new Form();

            form.addQuestion(new Question());
            form.addQuestion(new Question("what day is it?"));
            form.addQuestion(new Question("Do you enjoy sports?"));

            repository.save(form);

            log.info("Created new Form");


            for (Form f : repository.findAll()) {
                log.info(f.getId().toString());
                log.info(f.toString());
            }
        };
    }
}