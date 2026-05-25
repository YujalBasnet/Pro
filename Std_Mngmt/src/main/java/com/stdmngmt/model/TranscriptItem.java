package com.stdmngmt.model;

public class TranscriptItem {
    private final Course course;
    private final Grade grade;

    public TranscriptItem(Course course, Grade grade) {
        this.course = course;
        this.grade = grade;
    }

    public Course getCourse() {
        return course;
    }

    public Grade getGrade() {
        return grade;
    }
}
