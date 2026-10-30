package com.jobportal.service;

import com.jobportal.dto.DashboardStatsResponse;
import com.jobportal.model.ApplicationStatus;
import com.jobportal.model.Job;
import com.jobportal.model.JobStatus;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(UserRepository userRepository, JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public DashboardStatsResponse getStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalJobs(jobRepository.count());
        stats.setOpenJobs(jobRepository.countByStatus(JobStatus.OPEN));
        stats.setTotalApplications(applicationRepository.count());
        stats.setTotalJobSeekers(userRepository.countByRole(Role.JOB_SEEKER));
        stats.setTotalEmployers(userRepository.countByRole(Role.EMPLOYER));

        Map<String, Long> statusMap = new HashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            statusMap.put(s.name(), applicationRepository.countByStatus(s));
        }
        stats.setApplicationsByStatus(statusMap);

        Map<String, Long> categoryMap = new HashMap<>();
        List<Job> allJobs = jobRepository.findAll();
        for (Job j : allJobs) {
            categoryMap.put(j.getCategory(), categoryMap.getOrDefault(j.getCategory(), 0L) + 1);
        }
        stats.setJobsByCategory(categoryMap);

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
    }

    @Transactional
    public User changeUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }
}
