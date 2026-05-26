package com.stdmngmt.repository.inmemory;

import com.stdmngmt.model.Enrollment;
import com.stdmngmt.repository.EnrollmentRepository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class InMemoryEnrollmentRepository implements EnrollmentRepository {
    private final Map<Long, Map<String, Enrollment>> enrollments = new LinkedHashMap<>();

    @Override
    public synchronized List<Enrollment> findByStudentId(long studentId) {
        Map<String, Enrollment> byCourse = enrollments.get(studentId);
        if (byCourse == null) {
            return List.of();
        }
        List<Enrollment> results = new ArrayList<>();
        for (Enrollment enrollment : byCourse.values()) {
            results.add(copyOf(enrollment));
        }
        return results;
    }

    @Override
    public synchronized Optional<Enrollment> findByStudentAndCourse(long studentId, String courseCode) {
        if (courseCode == null) {
            return Optional.empty();
        }
        Map<String, Enrollment> byCourse = enrollments.get(studentId);
        if (byCourse == null) {
            return Optional.empty();
        }
        Enrollment enrollment = byCourse.get(courseCode);
        return enrollment == null ? Optional.empty() : Optional.of(copyOf(enrollment));
    }

    @Override
    public synchronized Enrollment save(Enrollment enrollment) {
        if (enrollment == null) {
            throw new IllegalArgumentException("Enrollment is required.");
        }
        Map<String, Enrollment> byCourse = enrollments.computeIfAbsent(
            enrollment.getStudentId(),
            id -> new LinkedHashMap<>()
        );
        String courseCode = enrollment.getCourseCode();
        if (courseCode == null || courseCode.isBlank()) {
            throw new IllegalArgumentException("Course code is required.");
        }
        if (byCourse.containsKey(courseCode)) {
            throw new IllegalArgumentException("Enrollment already exists.");
        }
        Enrollment copy = copyOf(enrollment);
        byCourse.put(courseCode, copy);
        return copyOf(copy);
    }

    @Override
    public synchronized Enrollment update(Enrollment enrollment) {
        if (enrollment == null) {
            throw new IllegalArgumentException("Enrollment is required.");
        }
        Map<String, Enrollment> byCourse = enrollments.get(enrollment.getStudentId());
        if (byCourse == null || !byCourse.containsKey(enrollment.getCourseCode())) {
            throw new IllegalArgumentException("Enrollment not found.");
        }
        Enrollment copy = copyOf(enrollment);
        byCourse.put(enrollment.getCourseCode(), copy);
        return copyOf(copy);
    }

    @Override
    public synchronized boolean deleteByStudentAndCourse(long studentId, String courseCode) {
        Map<String, Enrollment> byCourse = enrollments.get(studentId);
        if (byCourse == null) {
            return false;
        }
        boolean removed = byCourse.remove(courseCode) != null;
        if (byCourse.isEmpty()) {
            enrollments.remove(studentId);
        }
        return removed;
    }

    @Override
    public synchronized int deleteByStudentId(long studentId) {
        Map<String, Enrollment> removed = enrollments.remove(studentId);
        return removed == null ? 0 : removed.size();
    }

    @Override
    public synchronized int deleteByCourseCode(String courseCode) {
        if (courseCode == null) {
            return 0;
        }
        int count = 0;
        Iterator<Map.Entry<Long, Map<String, Enrollment>>> iterator = enrollments.entrySet().iterator();
        while (iterator.hasNext()) {
            Map<String, Enrollment> byCourse = iterator.next().getValue();
            if (byCourse.remove(courseCode) != null) {
                count++;
            }
            if (byCourse.isEmpty()) {
                iterator.remove();
            }
        }
        return count;
    }

    private Enrollment copyOf(Enrollment enrollment) {
        return new Enrollment(enrollment.getStudentId(), enrollment.getCourseCode(), enrollment.getGrade());
    }
}
