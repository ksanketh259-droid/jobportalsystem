package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationStatusUpdateRequest;
import com.jobportal.model.Application;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.security.UserContext;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(@Valid @RequestBody ApplicationRequest request) {
        User user = UserContext.requireRole(Role.JOB_SEEKER, Role.ADMIN);
        return ResponseEntity.ok(applicationService.apply(request, user));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications() {
        User user = UserContext.requireRole(Role.JOB_SEEKER, Role.ADMIN);
        return ResponseEntity.ok(applicationService.getMyApplications(user));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, user));
    }

    @GetMapping("/employer-all")
    public ResponseEntity<List<Application>> getEmployerApplications() {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(applicationService.getEmployerApplications(user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        User user = UserContext.requireRole(Role.EMPLOYER, Role.ADMIN);
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, request, user));
    }
}
