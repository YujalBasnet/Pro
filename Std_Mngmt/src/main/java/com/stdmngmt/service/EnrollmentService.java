package com.stdmngmt.service;

import com.stdmngmt.model.Course;
import com.stdmngmt.model.Enrollment;
import com.stdmngmt.model.Grade;
import com.stdmngmt.model.TranscriptItem;
import com.stdmngmt.repository.CourseRepository;
import com.stdmngmt.repository.EnrollmentRepository;
import com.stdmngmt.repository.StudentRepository;
import com.stdmngmt.util.Validators;

import java.util.ArrayList;
import java.util.List;

public class EnrollmentService {
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(StudentRepository studentRepository, CourseRepository courseRepository,
                             EnrollmentRepository enrollmentRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public void enrollStudent(long studentId, String courseCode) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException("Student not found: " + studentId));

        String cleanCode = Validators.normalizeCourseCode(courseCode);
        Validators.validateCourseCode(cleanCode);

        courseRepository.findByCode(cleanCode)
            .orElseThrow(() -> new CourseNotFoundException("Course not found: " + cleanCode));

        enrollmentRepository.findByStudentAndCourse(studentId, cleanCode).ifPresent(existing -> {
            throw new IllegalArgumentException("Student is already enrolled in this course.");
        });

        Enrollment enrollment = new Enrollment(studentId, cleanCode, null);
        enrollmentRepository.save(enrollment);
    }

    public void recordGrade(long studentId, String courseCode, Grade grade) {
        if (grade == null) {
            throw new IllegalArgumentException("Grade is required.");
        }

        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException("Student not found: " + studentId));

        String cleanCode = Validators.normalizeCourseCode(courseCode);
        Validators.validateCourseCode(cleanCode);

        courseRepository.findByCode(cleanCode)
            .orElseThrow(() -> new CourseNotFoundException("Course not found: " + cleanCode));

        Enrollment existing = enrollmentRepository.findByStudentAndCourse(studentId, cleanCode)
            .orElseThrow(() -> new IllegalArgumentException("Student is not enrolled in this course."));

        Enrollment updated = new Enrollment(existing.getStudentId(), existing.getCourseCode(), grade);
        enrollmentRepository.update(updated);
    }

    public List<TranscriptItem> getTranscript(long studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException("Student not found: " + studentId));

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<TranscriptItem> transcript = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            Course course = courseRepository.findByCode(enrollment.getCourseCode()).orElse(null);
            if (course != null) {
                transcript.add(new TranscriptItem(course, enrollment.getGrade()));
            }
        }
        return transcript;
    }

    public void deleteEnrollmentsForStudent(long studentId) {
        enrollmentRepository.deleteByStudentId(studentId);
    }

    public void deleteEnrollmentsForCourse(String courseCode) {
        String cleanCode = Validators.normalizeCourseCode(courseCode);
        if (cleanCode == null) {
            return;
        }
        enrollmentRepository.deleteByCourseCode(cleanCode);
    }
}
