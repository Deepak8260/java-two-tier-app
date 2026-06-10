package com.example.employeedirectory.service;

import com.example.employeedirectory.model.Employee;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final List<Employee> employees = new ArrayList<>();
    private final AtomicLong nextId = new AtomicLong(1);

    @PostConstruct
    public void initializeSampleData() {
        addEmployee(new Employee(0, "Aarav Patel", "aarav.patel@example.com", "Software Engineer", "Engineering"));
        addEmployee(new Employee(0, "Mia Thompson", "mia.thompson@example.com", "Product Manager", "Product"));
        addEmployee(new Employee(0, "Noah Kim", "noah.kim@example.com", "QA Analyst", "Quality"));
        addEmployee(new Employee(0, "Leila Gonzalez", "leila.gonzalez@example.com", "UX Designer", "Design"));
    }

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employees);
    }

    public Employee addEmployee(Employee employee) {
        long id = nextId.getAndIncrement();
        employee.setId(id);
        employees.add(employee);
        return employee;
    }

    public boolean deleteEmployee(long id) {
        return employees.removeIf(employee -> employee.getId() == id);
    }

    public List<Employee> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllEmployees();
        }
        String lowerName = name.trim().toLowerCase();
        return employees.stream()
                .filter(employee -> employee.getName().toLowerCase().contains(lowerName))
                .collect(Collectors.toList());
    }
}
