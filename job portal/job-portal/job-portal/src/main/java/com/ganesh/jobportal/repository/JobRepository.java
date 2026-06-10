package com.ganesh.jobportal.repository;

import com.ganesh.jobportal.model.Job;
import com.ganesh.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatusOrderByCreatedAtDesc(Job.JobStatus status);

    List<Job> findByRecruiterOrderByCreatedAtDesc(User recruiter);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Job> findByLocation(@Param("location") String location);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND j.jobType = :jobType")
    List<Job> findByJobType(@Param("jobType") Job.JobType jobType);
}
