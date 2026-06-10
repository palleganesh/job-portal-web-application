package com.ganesh.jobportal.dto;

import com.ganesh.jobportal.model.Job;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class JobDTO {

    @Data
    public static class JobRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Company is required")
        private String company;

        @NotBlank(message = "Location is required")
        private String location;

        @NotNull(message = "Job type is required")
        private Job.JobType jobType;

        @NotBlank(message = "Description is required")
        private String description;

        private String requirements;
        private String salary;
        private Job.JobStatus status;
    }

    @Data
    public static class JobResponse {
        private Long id;
        private String title;
        private String company;
        private String location;
        private String jobType;
        private String description;
        private String requirements;
        private String salary;
        private String status;
        private String recruiterName;
        private Long recruiterId;
        private LocalDateTime createdAt;
        private long applicationCount;

        public static JobResponse from(Job job, long appCount) {
            JobResponse r = new JobResponse();
            r.id = job.getId();
            r.title = job.getTitle();
            r.company = job.getCompany();
            r.location = job.getLocation();
            r.jobType = job.getJobType() != null ? job.getJobType().name() : null;
            r.description = job.getDescription();
            r.requirements = job.getRequirements();
            r.salary = job.getSalary();
            r.status = job.getStatus() != null ? job.getStatus().name() : null;
            r.recruiterName = job.getRecruiter().getName();
            r.recruiterId = job.getRecruiter().getId();
            r.createdAt = job.getCreatedAt();
            r.applicationCount = appCount;
            return r;
        }
    }
}
