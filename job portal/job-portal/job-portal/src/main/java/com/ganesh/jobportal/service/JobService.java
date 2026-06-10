package com.ganesh.jobportal.service;

import com.ganesh.jobportal.dto.JobDTO.*;
import com.ganesh.jobportal.model.Job;
import com.ganesh.jobportal.model.User;
import com.ganesh.jobportal.repository.JobApplicationRepository;
import com.ganesh.jobportal.repository.JobRepository;
import com.ganesh.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    public JobResponse createJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .salary(request.getSalary())
                .status(request.getStatus() != null ? request.getStatus() : Job.JobStatus.ACTIVE)
                .recruiter(recruiter)
                .build();

        job = jobRepository.save(job);
        return JobResponse.from(job, 0);
    }

    public List<JobResponse> getAllActiveJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.ACTIVE)
                .stream()
                .map(j -> JobResponse.from(j, applicationRepository.countByJob(j)))
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return JobResponse.from(job, applicationRepository.countByJob(job));
    }

    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.searchByKeyword(keyword)
                .stream()
                .map(j -> JobResponse.from(j, applicationRepository.countByJob(j)))
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsByRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepository.findByRecruiterOrderByCreatedAtDesc(recruiter)
                .stream()
                .map(j -> JobResponse.from(j, applicationRepository.countByJob(j)))
                .collect(Collectors.toList());
    }

    public JobResponse updateJob(Long id, JobRequest request, String recruiterEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new AccessDeniedException("Not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSalary(request.getSalary());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        job = jobRepository.save(job);
        return JobResponse.from(job, applicationRepository.countByJob(job));
    }

    public void deleteJob(Long id, String recruiterEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new AccessDeniedException("Not authorized to delete this job");
        }

        jobRepository.delete(job);
    }
}
