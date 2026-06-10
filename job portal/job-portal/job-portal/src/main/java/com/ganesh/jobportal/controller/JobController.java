package com.ganesh.jobportal.controller;

import com.ganesh.jobportal.dto.JobDTO.*;
import com.ganesh.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // Public: search and view individual job
    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(@RequestParam(required = false) String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity.ok(jobService.getAllActiveJobs());
        }
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Recruiter: manage own jobs
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(jobService.createJob(request, auth.getName()));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getMyJobs(Authentication auth) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id,
                                                  @Valid @RequestBody JobRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(jobService.updateJob(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication auth) {
        jobService.deleteJob(id, auth.getName());
        return ResponseEntity.ok(java.util.Map.of("message", "Job deleted successfully"));
    }
}
