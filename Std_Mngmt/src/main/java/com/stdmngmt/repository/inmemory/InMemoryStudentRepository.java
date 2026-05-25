package com.stdmngmt.repository.inmemory;

import com.stdmngmt.model.Student;
import com.stdmngmt.repository.StudentRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryStudentRepository implements StudentRepository {
    private final Map<Long, Student> students = new LinkedHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(1000);

    @Override
    public synchronized List<Student> findAll() {
        List<Student> results = new ArrayList<>();
        for (Student student : students.values()) {
            results.add(copyOf(student));
        }
        return results;
    }

    @Override
    public synchronized Optional<Student> findById(long id) {
        Student student = students.get(id);
        return student == null ? Optional.empty() : Optional.of(copyOf(student));
    }

    @Override
    public synchronized Optional<Student> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        String normalized = email.trim().toLowerCase();
        for (Student student : students.values()) {
            if (student.getEmail() != null && student.getEmail().equalsIgnoreCase(normalized)) {
                return Optional.of(copyOf(student));
            }
        }
        return Optional.empty();
    }

    @Override
    public synchronized Student save(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student is required.");
        }
        Student copy = copyOf(student);
        long id = copy.getId();
        if (id == 0L) {
            id = idSequence.incrementAndGet();
            copy.setId(id);
        } else if (students.containsKey(id)) {
            throw new IllegalArgumentException("Student ID already exists: " + id);
        }
        students.put(id, copy);
        return copyOf(copy);
    }

    @Override
    public synchronized Student update(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student is required.");
        }
        long id = student.getId();
        if (id <= 0L || !students.containsKey(id)) {
            throw new IllegalArgumentException("Student not found: " + id);
        }
        Student copy = copyOf(student);
        students.put(id, copy);
        return copyOf(copy);
    }

    @Override
    public synchronized boolean deleteById(long id) {
        return students.remove(id) != null;
    }

    @Override
    public synchronized List<Student> searchByName(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        String normalized = query.trim().toLowerCase();
        List<Student> results = new ArrayList<>();
        for (Student student : students.values()) {
            String name = (student.getFirstName() + " " + student.getLastName()).trim().toLowerCase();
            if (name.contains(normalized)) {
                results.add(copyOf(student));
            }
        }
        return results;
    }

    private Student copyOf(Student student) {
        return new Student(
            student.getId(),
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getPhone(),
            student.getDateOfBirth(),
            student.getStatus()
        );
    }
}
