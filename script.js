//let students = JSON.parse(localStorage.getItem("students")) || [];
let students = [];
let isUpdate = false;

const studentForm = document.getElementById("studentForm");
const studentTableBody = document.querySelector("#studentTable tbody");

function showToast(message, color = "#28a745") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor = color;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderTable() {
  studentTableBody.innerHTML = "";

  students.forEach((student) => {
    const row = `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
            <td class="action-buttons">
              <button onclick="editStudent(${student.id})">Edit</button>
              <button class="delete" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
          </tr>
        `;
    studentTableBody.innerHTML += row;
  });
}

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
  fetchSQL();
}

function resetForm() {
  studentForm.reset();
  isUpdate = false;
  document.getElementById("studentId").value = "";
}

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const studentId = document.getElementById("studentId").value;

  // Validation
  if (!name || !phone || !email) {
    showToast("Please fill all fields.", "#dc3545");
    return;
  }

  const phoneRegex = /^[789]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showToast("Invalid phone number format.", "#dc3545");
    document.getElementById("phone").focus();
    return;
  }

  const studentData = { name, phone, email, studentId };

  if(isUpdate){
    updateToLocal(studentData);
    isUpdate=false;
  }else {
    saveToLocal(studentData);
  }

  if (studentId === "") {
    students.push(studentData);
    showToast("Student added successfully!");
  } else {
    students[studentId] = studentData;
    showToast("Student updated successfully!");
  }

  saveToLocalStorage();
  renderTable();
  resetForm();
});

// function editStudent(index) {
//   console.log("editStudent called with index:", index);
//   console.log("students array:", students);

//   if (!students[index]) {
//     console.error("No student found at index", index);
//     return;
//   }

//   document.getElementById("name").value = student[index].name;
//   document.getElementById("phone").value = student[index].phone;
//   document.getElementById("email").value = student[email].email;
// }

function editStudent(id) {
  console.log("editStudent called with id:", id);
  console.log("students array:", students);

  // Find the student with the matching id
  const student = students.find((s) => s.id == id);

  if (!student) {
    console.error("No student found with id", id);
    return;
  }

  // Populate form fields with the student data
  document.getElementById("name").value = student.name;
  document.getElementById("phone").value = student.phone;
  document.getElementById("email").value = student.email;
  document.getElementById("studentId").value = id;
  isUpdate = true;
}


function deleteStudent(ID) {
  if (confirm("Are you sure you want to delete this student?")) {
    //students.splice(index, 1);
    deleteToLocal(ID);
    saveToLocalStorage();
    renderTable();
    showToast("Student deleted.", "#dc3545");
  }
}

function fetchSQL() {
  fetch("http://localhost/get_students.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("data===>", data);
      students = data;
      renderTable();
    })
    .catch((error) => console.error("Error:", error));
}

function saveToLocal(studentData) {
  let name = studentData.name;
  let phone = studentData.phone;
  let email = studentData.email;

  fetch("http://localhost/save_student.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone, email }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("studentForm").reset();
      fetchSQL();
    })
    .catch((err) => console.error("Error:", err));
}


function updateToLocal(studentData) {
  let id = studentData.studentId;
  let name = studentData.name;
  let phone = studentData.phone;
  let email = studentData.email;

  console.log("Update Body===>", JSON.stringify({ id, name, phone, email }));

  fetch("http://localhost/update_student.php", {
    method: "POST", // ✅ Use POST (or PUT if your PHP handles it)
    headers: {
      "Content-Type": "application/json", // ✅ Correct header
    },
    body: JSON.stringify({ id, name, phone, email }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Update response:", data);
      document.getElementById("studentForm").reset();
      fetchSQL(); // ✅ Refresh data after update
    })
    .catch((err) => console.error("Error:", err));
}

function deleteToLocal(ID) {
  fetch("http://localhost/delete_student.php", {
    method: "DELETE", // ✅ still valid
    headers: {
      "Content-Type": "application/json", // ✅ fixed header name
    },
    body: JSON.stringify({ id: ID }), // ✅ send JSON
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Delete response:", data);
      if (data.status === "success") {
        fetchSQL(); // Refresh table after delete
      } else {
        console.error("Delete failed:", data.message);
      }
    })
    .catch((err) => console.error("Error:", err));
}

// Initial render
renderTable();
window.onload = function () {
  // Your code here
  fetchSQL();
};
