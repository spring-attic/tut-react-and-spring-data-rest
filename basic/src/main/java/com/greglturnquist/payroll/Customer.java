package com.greglturnquist.payroll;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Customer {
    private @Id @GeneratedValue Long id;
    private String name;
    private LocalDateTime startWork;
    private LocalDateTime endWork;

    public Customer() {}

    public Customer(String name, LocalDateTime startWork, LocalDateTime endWork){
        this.name = name;
        this.startWork = startWork;
        this.endWork = endWork;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStartWork() {
        return startWork;
    }

    public void setStartWork(LocalDateTime startWork) {
        this.startWork = startWork;
    }

    public LocalDateTime getEndWork() {
        return endWork;
    }

    public void setEndWork(LocalDateTime endWork) {
        this.endWork = endWork;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", startWork=" + startWork +
                ", endWork=" + endWork +
                '}';
    }
}
