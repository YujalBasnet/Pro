package com.stdmngmt.repository.inmemory;

import com.stdmngmt.model.Course;
import com.stdmngmt.repository.CourseRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class InMemoryCourseRepository implements CourseRepository {
    private final Map<String, Course> courses = new LinkedHashMap<>();

    @Override
    public synchronized List<Course> findAll() {
        List<Course> results = new ArrayList<>();
        for (Course course : courses.values()) {
            results.add(copyOf(course));
        }
        return results;
    }

    @Override
    public synchronized Optional<Course> findByCode(String code) {
        if (code == null) {
            return Optional.empty();
        }
        Course course = courses.get(code);
        return course == null ? Optional.empty() : Optional.of(copyOf(course));
    }

    @Override
    public synchronized Course save(Course course) {
        if (course == null) {
            throw new IllegalArgumentException("Course is required.");
        }
        String code = course.getCode();
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Course code is required.");
        }
        if (courses.containsKey(code)) {
            throw new IllegalArgumentException("Course code already exists: " + code);
        }
        Course copy = copyOf(course);
        courses.put(code, copy);
        return copyOf(copy);
    }

    @Override
    public synchronized Course update(Course course) {
        if (course == null) {
            throw new IllegalArgumentException("Course is required.");
        }
        String code = course.getCode();
        if (code == null || code.isBlank() || !courses.containsKey(code)) {
            throw new IllegalArgumentException("Course not found: " + code);
        }
        Course copy = copyOf(course);
        courses.put(code, copy);
        return copyOf(copy);
    }

    @Override
    public synchronized boolean deleteByCode(String code) {
        if (code == null) {
            return false;
        }
        return courses.remove(code) != null;
    }

    private Course copyOf(Course course) {
        return new Course(course.getCode(), course.getTitle(), course.getCredits());
    }
}
