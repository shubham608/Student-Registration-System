let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;
const table = document.getElementById("studentTable");
const form = document.getElementById("studentForm");

// Display students detail
function displayStudents() {
    table.innerHTML = "";
    students.forEach((student, index) => {
        table.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="icon-btn edit" onclick="editStudent(${index})" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="icon-btn delete" onclick="deleteStudent(${index})" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>
            </tr>
        `;
    });
}

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    let isValid = true;

    if (!/^[A-Za-z ]+$/.test(name)) {
        showError("nameError", "Name should contain only characters", "name");
        isValid = false;
    }

    if (!/^[0-9]+$/.test(id)) {
        showError("idError", "Student ID should contain only numbers", "studentId");
        isValid = false;
    }

    if (
        students.some((student, index) =>
            student.id === id && index !== editIndex
        )
    ) {
        showError("idError", "Student ID already exists", "studentId");
        isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        showError("emailError", "Please enter a valid email (example: name@gmail.com)", "email");
        isValid = false;
    }

    // Contact validation
    if (!/^[0-9]+$/.test(contact)) {
        showError(
            "contactError",
            "Contact number should contain only digits",
            "contact"
        );
        isValid = false;
    } 
    else if (contact.length < 10) {
        showError(
            "contactError",
            "Contact number must have at least 10 digits",
            "contact"
        );
        isValid = false;
    }

    if (!isValid) return;

    if (editIndex === null) {
        students.push({ name, id, email, contact });
    } else {
        students[editIndex] = { name, id, email, contact };
        editIndex = null;
        document.querySelector("button[type='submit']").textContent = "Add Student";
    }

    localStorage.setItem("students", JSON.stringify(students));

    form.reset();
    displayStudents();
});

// Delete with confirmation
function deleteStudent(index) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

// Edit student information
function editStudent(index) {
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("studentId").value = student.id;
    document.getElementById("email").value = student.email;
    document.getElementById("contact").value = student.contact;

    editIndex = index;  
    document.querySelector("button[type='submit']").textContent = "Update Student";
}

// Error
function showError(errorId, message, inputId) {
    document.getElementById(errorId).textContent = message;
    document.getElementById(inputId).classList.add("input-error");
}

function clearErrors() {
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(input =>
        input.classList.remove("input-error")
    );
}

displayStudents();
