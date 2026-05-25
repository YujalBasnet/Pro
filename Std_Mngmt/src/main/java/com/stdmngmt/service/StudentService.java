package com.stdmngmt.service;

import com.stdmngmt.model.Student;
import com.stdmngmt.model.StudentStatus;
import com.stdmngmt.repository.StudentRepository;
import com.stdmngmt.util.Validators;

import java.time.LocalDate;
import java.util.List;

public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> listStudents() {
        return repository.findAll();
    }

    public Student getStudent(long id) {
        return repository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException("Student not found: " + id));
    }

    public Student createStudent(String firstName, String lastName, String email, String phone, LocalDate dateOfBirth) {
        String cleanFirstName = Validators.requireNonBlank(firstName, "First name");
        String cleanLastName = Validators.requireNonBlank(lastName, "Last name");
        String cleanEmail = Validators.normalizeEmail(email);
        String cleanPhone = Validators.normalizePhone(phone);

        Validators.validateEmail(cleanEmail);
        Validators.validatePhone(cleanPhone);
        Validators.validateDateOfBirth(dateOfBirth);

        repository.findByEmail(cleanEmail).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already in use.");
        });

        Student student = new Student(
            0L,
            cleanFirstName,
            cleanLastName,
            cleanEmail,
            cleanPhone,
            dateOfBirth,
            StudentStatus.ACTIVE
        );

        return repository.save(student);
    }

    public Student updateStudent(long id, String firstName, String lastName, String email,
                                 String phone, LocalDate dateOfBirth, StudentStatus status) {
        getStudent(id);

        String cleanFirstName = Validators.requireNonBlank(firstName, "First name");
        String cleanLastName = Validators.requireNonBlank(lastName, "Last name");
        String cleanEmail = Validators.normalizeEmail(email);
        String cleanPhone = Validators.normalizePhone(phone);

        Validators.validateEmail(cleanEmail);
        Validators.validatePhone(cleanPhone);
        Validators.validateDateOfBirth(dateOfBirth);

        if (status == null) {
            throw new IllegalArgumentException("Status is required.");
        }

        repository.findByEmail(cleanEmail).ifPresent(existing -> {
            if (existing.getId() != id) {
                throw new IllegalArgumentException("Email already in use.");
            }
        });

        Student updated = new Student(
            id,
            cleanFirstName,
            cleanLastName,
            cleanEmail,
            cleanPhone,
            dateOfBirth,
            status
        );

        return repository.update(updated);
    }

    public void deleteStudent(long id) {
        if (!repository.deleteById(id)) {
            throw new StudentNotFoundException("Student not found: " + id);
        }
    }

    public List<Student> searchStudents(String query) {
        Validators.requireNonBlank(query, "Search query");
        return repository.searchByName(query);
    }
}
