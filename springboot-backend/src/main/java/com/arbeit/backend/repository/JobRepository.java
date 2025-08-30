package com.arbeit.backend.repository;

import com.arbeit.backend.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    Optional<Job> findByJobId(String jobId);

    List<Job> findByCompanyEmail(String companyEmail);

    List<Job> findByStatus(String status);

    List<Job> findByCompanyEmailAndStatus(String companyEmail, String status);

    @Query("{ 'status': 'Active' }")
    List<Job> findActiveJobs();

    @Query("{ 'status': 'Active', 'jobId': ?0 }")
    Optional<Job> findActiveJobByJobId(String jobId);

    boolean existsByJobId(String jobId);

    @Query(value = "{ 'status': 'Active' }", sort = "{ 'postedDate': -1 }")
    List<Job> findActiveJobsSortedByPostedDate();

    long countByCompanyEmail(String companyEmail);

    long countByStatus(String status);
}
