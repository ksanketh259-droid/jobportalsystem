package com.jobportal.dto;

import java.util.Map;

public class DashboardStatsResponse {

    private long totalJobs;
    private long openJobs;
    private long totalApplications;
    private long totalJobSeekers;
    private long totalEmployers;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> jobsByCategory;

    public DashboardStatsResponse() {
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getOpenJobs() {
        return openJobs;
    }

    public void setOpenJobs(long openJobs) {
        this.openJobs = openJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalJobSeekers() {
        return totalJobSeekers;
    }

    public void setTotalJobSeekers(long totalJobSeekers) {
        this.totalJobSeekers = totalJobSeekers;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public Map<String, Long> getJobsByCategory() {
        return jobsByCategory;
    }

    public void setJobsByCategory(Map<String, Long> jobsByCategory) {
        this.jobsByCategory = jobsByCategory;
    }
}
