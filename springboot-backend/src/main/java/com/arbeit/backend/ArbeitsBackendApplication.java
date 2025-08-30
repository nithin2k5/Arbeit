package com.arbeit.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ArbeitsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArbeitsBackendApplication.class, args);
    }

}
