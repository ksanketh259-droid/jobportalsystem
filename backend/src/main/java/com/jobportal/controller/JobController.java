package com.jobportal.controller;

import com.jobportal.dto.JobRequest;
import com.jobportal.model.*;
import com.jobportal.security.UserContext;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public JobController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(required = false) Double minSalary) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, location, category, jobType, experienceLevel, minSalary));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(jobService.getCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("job", job);

        User currentUser = UserContext.getCurrentUser();
        if (currentUser != null) {
            response.put("isSaved", jobService.isJobSavedByUser(id, currentUser.getId()));
            response.put("hasApplied", applicationService.hasUserApplied(id, currentUser.getId()));
        } else {
            response.put("isSaved", false);
            response.put("hasApplied", false);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest request) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(jobService.updateJob(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        jobService.deleteJob(id, user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Job> updateJobStatus(@PathVariable Long id, @RequestParam JobStatus status) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, user));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs() {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(jobService.getEmployerJobs(user.getId()));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Map<String, Object>> toggleSaveJob(@PathVariable Long id) {
        User user = UserContext.requireUser();
        boolean isSaved = jobService.toggleSaveJob(id, user);
        Map<String, Object> response = new HashMap<>();
        response.put("saved", isSaved);
        response.put("message", isSaved ? "Job bookmarked" : "Job removed from bookmarks");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/saved")
    public ResponseEntity<List<Job>> getSavedJobs() {
        User user = UserContext.requireUser();
        return ResponseEntity.ok(jobService.getSavedJobs(user));
    }
}
