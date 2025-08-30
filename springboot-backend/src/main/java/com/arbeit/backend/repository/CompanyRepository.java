package com.arbeit.backend.repository;

import com.arbeit.backend.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByCompanyEmail(String companyEmail);

    Optional<Company> findByBid(String bid);

    boolean existsByCompanyEmail(String companyEmail);

    boolean existsByBid(String bid);
}
