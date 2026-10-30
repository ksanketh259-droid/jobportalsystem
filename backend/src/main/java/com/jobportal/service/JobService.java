package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.model.*;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;

    public JobService(JobRepository jobRepository, SavedJobRepository savedJobRepository) {
        this.jobRepository = jobRepository;
        this.savedJobRepository = savedJobRepository;
    }

    public List<Job> searchJobs(String keyword, String location, String category, JobType jobType, ExperienceLevel experienceLevel, Double minSalary) {
        String cleanKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String cleanLocation = (location != null && !location.isBlank()) ? location.trim() : null;
        String cleanCategory = (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) ? category.trim() : null;

        return jobRepository.searchJobs(JobStatus.OPEN, cleanKeyword, cleanLocation, cleanCategory, jobType, experienceLevel, minSalary);
    }

    public List<Job> getAllJobsForAdmin() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found with ID: " + id));
    }

    @Transactional
    public Job createJob(JobRequest req, User employer) {
        Job job = new Job();
        mapJobRequestToEntity(req, job);
        job.setEmployer(employer);
        if (req.getCompany() == null || req.getCompany().isBlank()) {
            job.setCompany(employer.getCompanyName() != null ? employer.getCompanyName() : employer.getFullName());
        }
        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJob(Long id, JobRequest req, User currentUser) {
        Job job = getJobById(id);
        validateOwnershipOrAdmin(job, currentUser);

        mapJobRequestToEntity(req, job);
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id, User currentUser) {
        Job job = getJobById(id);
        validateOwnershipOrAdmin(job, currentUser);
        jobRepository.delete(job);
    }

    @Transactional
    public Job updateJobStatus(Long id, JobStatus status, User currentUser) {
        Job job = getJobById(id);
        validateOwnershipOrAdmin(job, currentUser);
        job.setStatus(status);
        return jobRepository.save(job);
    }

    public List<Job> getEmployerJobs(Long employerId) {
        return jobRepository.findByEmployerIdOrderByCreatedAtDesc(employerId);
    }

    public List<String> getCategories() {
        return jobRepository.findDistinctCategories();
    }

    @Transactional
    public boolean toggleSaveJob(Long jobId, User user) {
        Job job = getJobById(jobId);
        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            savedJobRepository.deleteByUserIdAndJobId(user.getId(), jobId);
            return false; // Unsaved
        } else {
            savedJobRepository.save(new SavedJob(user, job));
            return true; // Saved
        }
    }

    public List<Job> getSavedJobs(User user) {
        List<SavedJob> saved = savedJobRepository.findByUserIdOrderBySavedAtDesc(user.getId());
        return saved.stream().map(SavedJob::getJob).collect(Collectors.toList());
    }

    public boolean isJobSavedByUser(Long jobId, Long userId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }

    private void mapJobRequestToEntity(JobRequest req, Job job) {
        job.setTitle(req.getTitle().trim());
        job.setCompany(req.getCompany().trim());
        job.setLocation(req.getLocation().trim());
        job.setCategory(req.getCategory().trim());
        job.setJobType(req.getJobType());
        job.setExperienceLevel(req.getExperienceLevel());
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        if (req.getCurrency() != null && !req.getCurrency().isBlank()) {
            job.setCurrency(req.getCurrency().trim());
        }
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setResponsibilities(req.getResponsibilities());
        job.setBenefits(req.getBenefits());
        if (req.getStatus() != null) {
            job.setStatus(req.getStatus());
        }
    }

    private void validateOwnershipOrAdmin(Job job, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (!job.getEmployer().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to modify this job listing.");
        }
    }
}
