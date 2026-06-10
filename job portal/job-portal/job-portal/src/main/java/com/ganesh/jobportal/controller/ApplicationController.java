package com.ganesh.jobportal.controller;

import com.ganesh.jobportal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Job seeker applies to a job
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId,
                                         @RequestBody(required = false) Map<String, String> body,
                                         Authentication auth) {
        try {
            String coverLetter = body != null ? body.get("coverLetter") : null;
            Map<String, Object> response = applicationService.applyToJob(jobId, auth.getName(), coverLetter);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Job seeker views their own applications
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.getMyApplications(auth.getName()));
    }

    // Recruiter views applications for their job
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getApplicationsForJob(@PathVariable Long jobId,
                                                                            Authentication auth) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, auth.getName()));
    }

    // Recruiter updates application status
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long applicationId,
                                           @RequestBody Map<String, String> body,
                                           Authentication auth) {
        try {
            Map<String, Object> response = applicationService.updateApplicationStatus(
                    applicationId, body.get("status"), auth.getName());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
