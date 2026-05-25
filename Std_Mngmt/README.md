# Student Management System (Console)

A simple, layered Java console app you can extend into a backend later. It includes a UI layer, service layer, and repository layer with an in-memory implementation you can replace with a database-backed repository.

## Features
- Create, list, view, update, and delete students
- Search students by name
- Basic validation (email, phone, date of birth)
- Simple status management (ACTIVE / INACTIVE)

## Run
From the project root:

```bash
mvn -q exec:java
```

## Where to extend for backend
- Implement a database-backed repository that implements `StudentRepository`.
- Swap the repository in `App` to your new implementation.
