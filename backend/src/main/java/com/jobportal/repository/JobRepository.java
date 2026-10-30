
package com.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobportal.model.ExperienceLevel;
import com.jobportal.model.Job;
import com.jobportal.model.JobStatus;
import com.jobportal.model.JobType;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByEmployerIdOrderByCreatedAtDesc(Long employerId);

    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:keyword IS NULL OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND " +
           "(:minSalary IS NULL OR j.salaryMax >= :minSalary) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
            @Param("status") JobStatus status,
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("category") String category,
            @Param("jobType") JobType jobType,
            @Param("experienceLevel") ExperienceLevel experienceLevel,
            @Param("minSalary") Double minSalary
    );

    long countByStatus(JobStatus status);

    @Query("SELECT DISTINCT j.category FROM Job j")
    List<String> findDistinctCategories();
}
