package com.stdmngmt.repository;

import com.stdmngmt.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository {
    List<Student> findAll();

    Optional<Student> findById(long id);

    Optional<Student> findByEmail(String email);

    Student save(Student student);

    Student update(Student student);

    boolean deleteById(long id);

    List<Student> searchByName(String query);
}
