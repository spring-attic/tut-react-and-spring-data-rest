package com.greglturnquist.repository;

import com.greglturnquist.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Answer findById(long id);
}