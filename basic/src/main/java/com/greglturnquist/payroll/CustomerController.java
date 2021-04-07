package com.greglturnquist.payroll;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    private final CustomerRepository repository;

    CustomerController(CustomerRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/customers")
    List<Customer> all() {
        log.info("GetMapping /customers");

        List<Customer> ret = repository.findAll();
        log.info("Found " + ret.size() + " customers");

        for(Customer c : ret){
            log.info("Customer: " + c);
        }

        return ret;
    }

    @PostMapping("/customers")
    Customer newCustomer(@RequestBody Customer newCustomer) {
        log.info("PostMapping /customers");
        log.info("newCustomer " + newCustomer);

        return repository.save(newCustomer);
    }

    @GetMapping("/customers/{id}")
    Customer getCustomerById(@PathVariable Long id) {
        log.info("GetMapping /customers/{id}");
        log.info("Id: " + id);
        Customer ret = repository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Customer id: " + id + " Not found"));

        log.info("returning " + ret);
        return ret;
    }

    @PutMapping("/customers/{id}")
    Customer replaceCustomer(@RequestBody Customer newCustomer, @PathVariable Long id){
        log.info("PutMapping /customers/{id}");
        log.info("Id: " + id);

        Customer ret = repository.findById(id)
                .map(customer -> {
                    customer.setName(newCustomer.getName());
                    return repository.save(customer);
                })
                .orElseGet(() -> {
                    newCustomer.setId(id);
                    return repository.save(newCustomer);
                });

        log.info("updated or created customer: " + ret);
        return ret;
    }

    @DeleteMapping("/customers/{id}")
    void deleteCustomerById(@PathVariable Long id) {
        log.info("DeleteMapping /customers/{id}");
        log.info("Id: " + id);

        repository.deleteById(id);
    }
}
