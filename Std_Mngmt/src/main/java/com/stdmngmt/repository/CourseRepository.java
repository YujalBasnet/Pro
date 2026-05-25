package com.stdmngmt.repository;

import com.stdmngmt.model.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository {
    List<Course> findAll();

    Optional<Course> findByCode(String code);

    Course save(Course course);

    Course update(Course course);

    boolean deleteByCode(String code);
}
