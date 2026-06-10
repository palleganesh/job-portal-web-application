package com.ganesh.jobportal.repository;

import com.ganesh.jobportal.model.Job;
import com.ganesh.jobportal.model.JobApplication;
import com.ganesh.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByApplicantOrderByAppliedAtDesc(User applicant);

    List<JobApplication> findByJobOrderByAppliedAtDesc(Job job);

    Optional<JobApplication> findByJobAndApplicant(Job job, User applicant);

    boolean existsByJobAndApplicant(Job job, User applicant);

    long countByJob(Job job);
}
