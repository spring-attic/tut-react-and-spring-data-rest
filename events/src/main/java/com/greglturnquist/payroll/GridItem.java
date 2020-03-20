package com.greglturnquist.payroll;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
public class GridItem {
    private @Id @GeneratedValue Long id;
    private Contestant girl;
    private Contestant boy;
    private @Version @JsonIgnore Long version;
    private int colorState;

    private GridItem() {}

    public GridItem(Contestant girl, Contestant boy) {
        this.girl = girl;
        this.boy = boy;
        this.colorState=0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
