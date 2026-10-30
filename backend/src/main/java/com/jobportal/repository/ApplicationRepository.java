package com.jobportal.repository;

import com.jobportal.model.Application;
import com.jobportal.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantIdOrderByAppliedAtDesc(Long applicantId);

    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.employer.id = :employerId")
    long countByEmployerId(@Param("employerId") Long employerId);

    @Query("SELECT a FROM Application a WHERE a.job.employer.id = :employerId ORDER BY a.appliedAt DESC")
    List<Application> findByEmployerId(@Param("employerId") Long employerId);
}
