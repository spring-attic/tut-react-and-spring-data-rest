package com.greglturnquist.payroll;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CustomerDatabaseLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CustomerRepository.class);

    private final CustomerRepository repository;

    @Autowired
    CustomerDatabaseLoader(CustomerRepository repository) { this.repository = repository; }

    @Override
    public void run(String... args) {
        log.info("Preloading Customer Data");
        LocalDateTime now = LocalDateTime.now();

        this.repository.save(new Customer("Jana", now, now.plusHours(8)));
        this.repository.save(new Customer("Petr", now, now.plusHours(7)));
        this.repository.save(new Customer("Pavel", now, now.plusHours(6)));

        log.info("Numbers of loaded customers: " + this.repository.count());
    }
}
