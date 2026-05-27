package com.stdmngmt;

import com.stdmngmt.repository.CourseRepository;
import com.stdmngmt.repository.EnrollmentRepository;
import com.stdmngmt.repository.StudentRepository;
import com.stdmngmt.repository.inmemory.InMemoryCourseRepository;
import com.stdmngmt.repository.inmemory.InMemoryEnrollmentRepository;
import com.stdmngmt.repository.inmemory.InMemoryStudentRepository;
import com.stdmngmt.service.CourseService;
import com.stdmngmt.service.EnrollmentService;
import com.stdmngmt.service.StudentService;
import com.stdmngmt.ui.ConsoleMenu;
import com.stdmngmt.ui.InputReader;

public class App {
    public static void main(String[] args) {
        StudentRepository studentRepository = new InMemoryStudentRepository();
        CourseRepository courseRepository = new InMemoryCourseRepository();
        EnrollmentRepository enrollmentRepository = new InMemoryEnrollmentRepository();

        StudentService studentService = new StudentService(studentRepository);
        CourseService courseService = new CourseService(courseRepository);
        EnrollmentService enrollmentService = new EnrollmentService(
            studentRepository,
            courseRepository,
            enrollmentRepository
        );
        InputReader inputReader = new InputReader();
        ConsoleMenu menu = new ConsoleMenu(inputReader, studentService, courseService, enrollmentService);
        menu.run();
    }
}
