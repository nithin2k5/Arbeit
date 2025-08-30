package com.arbeit.backend.repository;

import com.arbeit.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {

    Optional<Application> findByUserIdAndJobId(String userId, String jobId);

    List<Application> findByJobId(String jobId);

    List<Application> findByUserId(String userId);

    List<Application> findByStatus(String status);

    @Query(sort = "{ 'appliedDate': -1 }")
    List<Application> findAllByOrderByAppliedDateDesc();

    boolean existsByUserIdAndJobId(String userId, String jobId);

    long countByJobId(String jobId);

    long countByStatus(String status);
}
