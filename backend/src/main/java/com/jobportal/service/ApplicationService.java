package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationStatusUpdateRequest;
import com.jobportal.model.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public Application apply(ApplicationRequest req, User applicant) {
        Job job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This job listing is closed for applications.");
        }

        if (applicationRepository.existsByJobIdAndApplicantId(job.getId(), applicant.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this position.");
        }

        Application app = new Application();
        app.setJob(job);
        app.setApplicant(applicant);
        app.setCoverLetter(req.getCoverLetter());
        app.setResumeFileName(req.getResumeFileName() != null ? req.getResumeFileName() : applicant.getResumeFileName());
        app.setApplicantPhone(req.getApplicantPhone() != null ? req.getApplicantPhone() : applicant.getPhone());
        app.setApplicantEmail(req.getApplicantEmail() != null ? req.getApplicantEmail() : applicant.getEmail());
        app.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(app);
    }

    public List<Application> getMyApplications(User applicant) {
        return applicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicant.getId());
    }

    public List<Application> getApplicationsForJob(Long jobId, User currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (currentUser.getRole() != Role.ADMIN && !job.getEmployer().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to view applications for this job");
        }

        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public List<Application> getEmployerApplications(User employer) {
        return applicationRepository.findByEmployerId(employer.getId());
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest req, User currentUser) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (currentUser.getRole() != Role.ADMIN && !app.getJob().getEmployer().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to modify this application");
        }

        app.setStatus(req.getStatus());
        if (req.getEmployerNotes() != null) {
            app.setEmployerNotes(req.getEmployerNotes());
        }
        if (req.getInterviewDate() != null) {
            app.setInterviewDate(req.getInterviewDate());
        }

        return applicationRepository.save(app);
    }

    public boolean hasUserApplied(Long jobId, Long applicantId) {
        return applicationRepository.existsByJobIdAndApplicantId(jobId, applicantId);
    }
}
