package com.stdmngmt;

import com.stdmngmt.repository.StudentRepository;
import com.stdmngmt.repository.inmemory.InMemoryStudentRepository;
import com.stdmngmt.service.StudentService;
import com.stdmngmt.ui.ConsoleMenu;
import com.stdmngmt.ui.InputReader;

public class App {
    public static void main(String[] args) {
        StudentRepository repository = new InMemoryStudentRepository();
        StudentService service = new StudentService(repository);
        InputReader inputReader = new InputReader();
        ConsoleMenu menu = new ConsoleMenu(inputReader, service);
        menu.run();
    }
}
