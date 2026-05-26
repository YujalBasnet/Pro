package com.stdmngmt.service;

import com.stdmngmt.model.Course;
import com.stdmngmt.repository.CourseRepository;
import com.stdmngmt.util.Validators;

import java.util.List;

public class CourseService {
    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public List<Course> listCourses() {
        return repository.findAll();
    }

    public Course getCourse(String code) {
        String cleanCode = Validators.normalizeCourseCode(code);
        Validators.validateCourseCode(cleanCode);
        return repository.findByCode(cleanCode)
            .orElseThrow(() -> new CourseNotFoundException("Course not found: " + cleanCode));
    }

    public Course createCourse(String code, String title, int credits) {
        String cleanCode = Validators.normalizeCourseCode(code);
        Validators.validateCourseCode(cleanCode);
        String cleanTitle = Validators.requireNonBlank(title, "Course title");
        Validators.validateCredits(credits);

        repository.findByCode(cleanCode).ifPresent(existing -> {
            throw new IllegalArgumentException("Course code already exists.");
        });

        Course course = new Course(cleanCode, cleanTitle, credits);
        return repository.save(course);
    }

    public Course updateCourse(String code, String title, int credits) {
        String cleanCode = Validators.normalizeCourseCode(code);
        Validators.validateCourseCode(cleanCode);
        String cleanTitle = Validators.requireNonBlank(title, "Course title");
        Validators.validateCredits(credits);

        repository.findByCode(cleanCode).orElseThrow(() -> new CourseNotFoundException("Course not found: " + cleanCode));

        Course updated = new Course(cleanCode, cleanTitle, credits);
        return repository.update(updated);
    }

    public void deleteCourse(String code) {
        String cleanCode = Validators.normalizeCourseCode(code);
        Validators.validateCourseCode(cleanCode);
        if (!repository.deleteByCode(cleanCode)) {
            throw new CourseNotFoundException("Course not found: " + cleanCode);
        }
    }
}
