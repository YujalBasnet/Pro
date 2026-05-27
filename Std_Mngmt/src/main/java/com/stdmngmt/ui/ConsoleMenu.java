package com.stdmngmt.ui;

import com.stdmngmt.model.Course;
import com.stdmngmt.model.Grade;
import com.stdmngmt.model.Student;
import com.stdmngmt.model.StudentStatus;
import com.stdmngmt.model.TranscriptItem;
import com.stdmngmt.service.CourseNotFoundException;
import com.stdmngmt.service.CourseService;
import com.stdmngmt.service.EnrollmentService;
import com.stdmngmt.service.StudentNotFoundException;
import com.stdmngmt.service.StudentService;

import java.time.LocalDate;
import java.util.List;

public class ConsoleMenu {
    private final InputReader input;
    private final StudentService studentService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public ConsoleMenu(InputReader input, StudentService studentService, CourseService courseService,
                       EnrollmentService enrollmentService) {
        this.input = input;
        this.studentService = studentService;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    public void run() {
        System.out.println("Student Management System");
        boolean running = true;
        while (running) {
            printMenu();
            String choice = input.readRequired("Select option: ");
            switch (choice) {
                case "1":
                    listStudents();
                    break;
                case "2":
                    addStudent();
                    break;
                case "3":
                    viewStudent();
                    break;
                case "4":
                    updateStudent();
                    break;
                case "5":
                    deleteStudent();
                    break;
                case "6":
                    searchStudents();
                    break;
                case "7":
                    listCourses();
                    break;
                case "8":
                    addCourse();
                    break;
                case "9":
                    enrollStudentInCourse();
                    break;
                case "10":
                    recordGrade();
                    break;
                case "11":
                    viewTranscript();
                    break;
                case "0":
                    running = false;
                    break;
                default:
                    System.out.println("Unknown option.");
            }
        }
        System.out.println("Goodbye.");
    }

    private void printMenu() {
        System.out.println();
        System.out.println("1) List students");
        System.out.println("2) Add student");
        System.out.println("3) View student");
        System.out.println("4) Update student");
        System.out.println("5) Delete student");
        System.out.println("6) Search by name");
        System.out.println("7) List courses");
        System.out.println("8) Add course");
        System.out.println("9) Enroll student in course");
        System.out.println("10) Record grade");
        System.out.println("11) View student transcript");
        System.out.println("0) Exit");
    }

    private void listStudents() {
        List<Student> students = studentService.listStudents();
        if (students.isEmpty()) {
            System.out.println("No students found.");
            return;
        }
        printStudentTable(students);
    }

    private void addStudent() {
        try {
            String firstName = input.readRequired("First name: ");
            String lastName = input.readRequired("Last name: ");
            String email = input.readRequired("Email: ");
            String phone = input.readOptional("Phone (optional): ");
            LocalDate dateOfBirth = input.readDateOptional("Date of birth");

            Student created = studentService.createStudent(firstName, lastName, email, phone, dateOfBirth);
            System.out.println("Created student with ID: " + created.getId());
        } catch (IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void viewStudent() {
        long id = input.readLong("Student ID: ");
        try {
            Student student = studentService.getStudent(id);
            printStudentDetail(student);
        } catch (StudentNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void updateStudent() {
        long id = input.readLong("Student ID: ");
        try {
            Student existing = studentService.getStudent(id);

            String firstName = readWithDefault("First name", existing.getFirstName());
            String lastName = readWithDefault("Last name", existing.getLastName());
            String email = readWithDefault("Email", existing.getEmail());
            String phone = readWithDefaultAllowClear("Phone", existing.getPhone());
            LocalDate dob = readDateWithDefaultAllowClear("Date of birth", existing.getDateOfBirth());
            StudentStatus status = readStatusWithDefault(existing.getStatus());

            Student updated = studentService.updateStudent(id, firstName, lastName, email, phone, dob, status);
            System.out.println("Updated student: " + updated.getId());
        } catch (StudentNotFoundException | IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void deleteStudent() {
        long id = input.readLong("Student ID: ");
        try {
            studentService.deleteStudent(id);
            enrollmentService.deleteEnrollmentsForStudent(id);
            System.out.println("Student deleted.");
        } catch (StudentNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void searchStudents() {
        String query = input.readRequired("Search name: ");
        try {
            List<Student> results = studentService.searchStudents(query);
            if (results.isEmpty()) {
                System.out.println("No matches found.");
                return;
            }
            printStudentTable(results);
        } catch (IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void listCourses() {
        List<Course> courses = courseService.listCourses();
        if (courses.isEmpty()) {
            System.out.println("No courses found.");
            return;
        }
        printCourseTable(courses);
    }

    private void addCourse() {
        try {
            String code = input.readRequired("Course code (e.g., CS101): ");
            String title = input.readRequired("Course title: ");
            int credits = input.readInt("Credits (1-10): ");

            Course created = courseService.createCourse(code, title, credits);
            System.out.println("Created course: " + created.getCode());
        } catch (IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void enrollStudentInCourse() {
        long studentId = input.readLong("Student ID: ");
        String courseCode = input.readRequired("Course code: ");
        try {
            enrollmentService.enrollStudent(studentId, courseCode);
            System.out.println("Enrollment saved.");
        } catch (StudentNotFoundException | CourseNotFoundException | IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void recordGrade() {
        long studentId = input.readLong("Student ID: ");
        String courseCode = input.readRequired("Course code: ");
        Grade grade = readGradeRequired();
        try {
            enrollmentService.recordGrade(studentId, courseCode, grade);
            System.out.println("Grade recorded.");
        } catch (StudentNotFoundException | CourseNotFoundException | IllegalArgumentException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private void viewTranscript() {
        long studentId = input.readLong("Student ID: ");
        try {
            List<TranscriptItem> transcript = enrollmentService.getTranscript(studentId);
            if (transcript.isEmpty()) {
                System.out.println("No enrollments found.");
                return;
            }
            printTranscriptTable(transcript);
        } catch (StudentNotFoundException ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

    private String readWithDefault(String label, String current) {
        String value = input.readOptional(label + " [" + current + "]: ");
        return value == null ? current : value;
    }

    private String readWithDefaultAllowClear(String label, String current) {
        String prompt = label + " [" + (current == null ? "none" : current) + "] (blank to keep, '-' to clear): ";
        String value = input.readOptional(prompt);
        if (value == null) {
            return current;
        }
        if ("-".equals(value)) {
            return null;
        }
        return value;
    }

    private LocalDate readDateWithDefaultAllowClear(String label, LocalDate current) {
        String currentText = current == null ? "none" : current.toString();
        while (true) {
            String raw = input.readOptional(label + " [" + currentText + "] (yyyy-MM-dd, blank to keep, '-' to clear): ");
            if (raw == null) {
                return current;
            }
            if ("-".equals(raw)) {
                return null;
            }
            try {
                return LocalDate.parse(raw);
            } catch (Exception ex) {
                System.out.println("Enter a valid date in yyyy-MM-dd.");
            }
        }
    }

    private StudentStatus readStatusWithDefault(StudentStatus current) {
        while (true) {
            String raw = input.readOptional("Status [" + current + "] (ACTIVE/INACTIVE): ");
            if (raw == null) {
                return current;
            }
            try {
                return StudentStatus.valueOf(raw.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                System.out.println("Enter ACTIVE or INACTIVE.");
            }
        }
    }

    private Grade readGradeRequired() {
        while (true) {
            String raw = input.readRequired("Grade (A/B/C/D/F/INCOMPLETE): ");
            try {
                return Grade.valueOf(raw.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                System.out.println("Enter A, B, C, D, F, or INCOMPLETE.");
            }
        }
    }

    private void printStudentTable(List<Student> students) {
        String header = String.format("%-6s %-22s %-28s %-16s %-10s", "ID", "Name", "Email", "Phone", "Status");
        System.out.println(header);
        System.out.println("-".repeat(header.length()));
        for (Student student : students) {
            String name = student.getFullName();
            String phone = student.getPhone() == null ? "" : student.getPhone();
            String row = String.format("%-6d %-22s %-28s %-16s %-10s",
                student.getId(), name, student.getEmail(), phone, student.getStatus());
            System.out.println(row);
        }
    }

    private void printCourseTable(List<Course> courses) {
        String header = String.format("%-10s %-32s %-7s", "Code", "Title", "Credits");
        System.out.println(header);
        System.out.println("-".repeat(header.length()));
        for (Course course : courses) {
            String row = String.format("%-10s %-32s %-7d", course.getCode(), course.getTitle(), course.getCredits());
            System.out.println(row);
        }
    }

    private void printTranscriptTable(List<TranscriptItem> transcript) {
        String header = String.format("%-10s %-32s %-7s %-10s", "Code", "Title", "Credits", "Grade");
        System.out.println(header);
        System.out.println("-".repeat(header.length()));
        for (TranscriptItem item : transcript) {
            Course course = item.getCourse();
            String grade = item.getGrade() == null ? "N/A" : item.getGrade().toString();
            String row = String.format("%-10s %-32s %-7d %-10s",
                course.getCode(), course.getTitle(), course.getCredits(), grade);
            System.out.println(row);
        }
    }

    private void printStudentDetail(Student student) {
        System.out.println("ID: " + student.getId());
        System.out.println("Name: " + student.getFullName());
        System.out.println("Email: " + student.getEmail());
        System.out.println("Phone: " + (student.getPhone() == null ? "" : student.getPhone()));
        System.out.println("Date of birth: " + (student.getDateOfBirth() == null ? "" : student.getDateOfBirth()));
        System.out.println("Status: " + student.getStatus());
    }
}
