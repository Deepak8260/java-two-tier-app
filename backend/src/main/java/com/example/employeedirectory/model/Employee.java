package com.example.employeedirectory.model;

public class Employee {

    private long id;
    private String name;
    private String email;
    private String position;
    private String department;

    public Employee() {
    }

    public Employee(long id, String name, String email, String position, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.position = position;
        this.department = department;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
