const BACKEND_PORT = 8081;
const apiHost = window.location.hostname || "localhost";
const API_BASE = `http://${apiHost}:${BACKEND_PORT}/api/employees`;
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const employeeTableBody = document.getElementById("employeeTableBody");
const totalEmployeesEl = document.getElementById("totalEmployees");
const totalDepartmentsEl = document.getElementById("totalDepartments");
const employeeForm = document.getElementById("employeeForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const positionInput = document.getElementById("positionInput");
const departmentInput = document.getElementById("departmentInput");
let currentEmployees = [];

async function fetchEmployees(query = "") {
    const url = query ? `${API_BASE}/search?name=${encodeURIComponent(query)}` : API_BASE;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Failed to load employees", response.status);
        return [];
    }
    return response.json();
}

function renderEmployees(employees) {
    currentEmployees = employees;
    employeeTableBody.innerHTML = "";

    if (employees.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="6" class="loading-row">No employees found.</td>`;
        employeeTableBody.appendChild(emptyRow);
        updateDashboard(employees);
        return;
    }

    employees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td><button class="delete-button" data-id="${employee.id}">Delete</button></td>
        `;
        employeeTableBody.appendChild(row);
    });

    updateDashboard(employees);
}

function updateDashboard(employees) {
    totalEmployeesEl.textContent = employees.length;
    const departments = new Set(employees.map((employee) => employee.department.trim()).filter(Boolean));
    totalDepartmentsEl.textContent = departments.size;
}

async function refreshEmployeeList() {
    const query = searchInput.value.trim();
    const employees = await fetchEmployees(query);
    renderEmployees(employees);
}

async function addEmployee(event) {
    event.preventDefault();
    const newEmployee = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        position: positionInput.value.trim(),
        department: departmentInput.value.trim(),
    };

    if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.department) {
        alert("Please fill in every field before adding an employee.");
        return;
    }

    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
    });

    if (!response.ok) {
        alert("Unable to add employee. Please try again.");
        return;
    }

    nameInput.value = "";
    emailInput.value = "";
    positionInput.value = "";
    departmentInput.value = "";

    refreshEmployeeList();
}

async function deleteEmployee(id) {
    const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!response.ok) {
        alert("Could not delete the employee. Please refresh and try again.");
        return;
    }
    refreshEmployeeList();
}

employeeTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) {
        return;
    }
    const id = button.dataset.id;
    deleteEmployee(id);
});

searchButton.addEventListener("click", async () => {
    await refreshEmployeeList();
});

searchInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        await refreshEmployeeList();
    }
});

employeeForm.addEventListener("submit", addEmployee);

window.addEventListener("load", refreshEmployeeList);
