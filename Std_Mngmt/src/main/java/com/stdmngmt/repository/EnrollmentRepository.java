package com.stdmngmt.repository;

import com.stdmngmt.model.Enrollment;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository {
    List<Enrollment> findByStudentId(long studentId);

    Optional<Enrollment> findByStudentAndCourse(long studentId, String courseCode);

    Enrollment save(Enrollment enrollment);

    Enrollment update(Enrollment enrollment);

    boolean deleteByStudentAndCourse(long studentId, String courseCode);

    int deleteByStudentId(long studentId);

    int deleteByCourseCode(String courseCode);
}
