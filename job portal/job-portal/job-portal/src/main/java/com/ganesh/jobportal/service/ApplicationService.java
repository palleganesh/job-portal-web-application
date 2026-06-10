package com.ganesh.jobportal.service;

import com.ganesh.jobportal.model.*;
import com.ganesh.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> applyToJob(Long jobId, String applicantEmail, String coverLetter) {
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new RuntimeException("Already applied to this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .coverLetter(coverLetter)
                .build();

        application = applicationRepository.save(application);
        return buildApplicationResponse(application);
    }

    public List<Map<String, Object>> getMyApplications(String applicantEmail) {
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByApplicantOrderByAppliedAtDesc(applicant)
                .stream().map(this::buildApplicationResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getApplicationsForJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Not authorized");
        }

        return applicationRepository.findByJobOrderByAppliedAtDesc(job)
                .stream().map(this::buildApplicationResponse).collect(Collectors.toList());
    }

    public Map<String, Object> updateApplicationStatus(Long applicationId, String status, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Not authorized");
        }

        application.setStatus(JobApplication.ApplicationStatus.valueOf(status));
        application = applicationRepository.save(application);
        return buildApplicationResponse(application);
    }

    private Map<String, Object> buildApplicationResponse(JobApplication app) {
        Map<String, Object> res = new HashMap<>();
        res.put("id", app.getId());
        res.put("jobId", app.getJob().getId());
        res.put("jobTitle", app.getJob().getTitle());
        res.put("company", app.getJob().getCompany());
        res.put("applicantName", app.getApplicant().getName());
        res.put("applicantEmail", app.getApplicant().getEmail());
        res.put("coverLetter", app.getCoverLetter());
        res.put("status", app.getStatus());
        res.put("appliedAt", app.getAppliedAt());
        return res;
    }
}
