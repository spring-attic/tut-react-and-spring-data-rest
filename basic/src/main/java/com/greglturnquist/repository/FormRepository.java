package com.greglturnquist.repository;

import com.greglturnquist.model.form.Form;
import com.greglturnquist.model.form.Question;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;
import java.util.UUID;

/**
 * Used to load/save Form in database.
 */
@RepositoryRestResource(collectionResourceRel = "forms", path = "forms")
public interface FormRepository extends PagingAndSortingRepository<Form, UUID> {

    //Save method.
    <S extends Question> void save(S s);

    //Find by id method.
    Optional<Form> findById(UUID id);

    //Delete by id method.
    void deleteById(UUID id);

}