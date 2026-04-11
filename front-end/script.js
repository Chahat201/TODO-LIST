// const taskInput = document.getElementById("taskInput");
// const taskDate = document.getElementById("taskDate");
// const addTaskBtn = document.getElementById("addTaskBtn");
// const taskList = document.getElementById("taskList");
// const clearCompletedBtn = document.getElementById("clearCompletedBtn");
// const deleteAllBtn = document.getElementById("deleteAllBtn");
// const filterButtons = document.querySelectorAll(".filter-btn");

// const totalTasks = document.getElementById("totalTasks");
// const completedTasks = document.getElementById("completedTasks");
// const pendingTasks = document.getElementById("pendingTasks");

// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// let currentFilter = "all";

// // Save tasks to localStorage
// function saveTasks() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// // Update task stats
// function updateStats() {
//   totalTasks.textContent = tasks.length;
//   completedTasks.textContent = tasks.filter(task => task.completed).length;
//   pendingTasks.textContent = tasks.filter(task => !task.completed).length;
// }

// // Render tasks
// function renderTasks() {
//   taskList.innerHTML = "";

//   let filteredTasks = tasks.filter(task => {
//     if (currentFilter === "completed") return task.completed;
//     if (currentFilter === "pending") return !task.completed;
//     return true;
//   });

//   if (filteredTasks.length === 0) {
//     taskList.innerHTML = `<li style="text-align:center; color:#777; padding:10px;">No tasks found.</li>`;
//     updateStats();
//     return;
//   }

//   filteredTasks.forEach(task => {
//     const li = document.createElement("li");
//     li.className = "task-item";

//     li.innerHTML = `
//       <div class="task-left">
//         <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
//         <div>
//           <div class="task-text ${task.completed ? "completed" : ""}">${task.text}</div>
//           <div class="task-date">Due: ${task.date || "No date"}</div>
//         </div>
//       </div>
//       <div class="task-actions">
//         <button class="edit-btn">Edit</button>
//         <button class="delete-btn">Delete</button>
//       </div>
//     `;

//     // Add event listeners properly
//     const checkbox = li.querySelector(".complete-checkbox");
//     const editBtn = li.querySelector(".edit-btn");
//     const deleteBtn = li.querySelector(".delete-btn");

//     checkbox.addEventListener("change", () => toggleTask(task.id));
//     editBtn.addEventListener("click", () => editTask(task.id));
//     deleteBtn.addEventListener("click", () => deleteTask(task.id));

//     taskList.appendChild(li);
//   });

//   updateStats();
// }

// // Add task
// function addTask() {
//   const text = taskInput.value.trim();
//   const date = taskDate.value;

//   if (text === "") {
//     alert("Please enter a task!");
//     return;
//   }

//   const newTask = {
//     id: Date.now(),
//     text: text,
//     date: date,
//     completed: false
//   };

//   tasks.push(newTask);
//   saveTasks();
//   renderTasks();

//   taskInput.value = "";
//   taskDate.value = "";
// }

// // Toggle task complete
// function toggleTask(id) {
//   tasks = tasks.map(task =>
//     task.id === id ? { ...task, completed: !task.completed } : task
//   );
//   saveTasks();
//   renderTasks();
// }

// // Delete task
// function deleteTask(id) {
//   tasks = tasks.filter(task => task.id !== id);
//   saveTasks();
//   renderTasks();
// }

// // Edit task
// function editTask(id) {
//   const task = tasks.find(task => task.id === id);
//   const newText = prompt("Edit your task:", task.text);

//   if (newText !== null && newText.trim() !== "") {
//     task.text = newText.trim();
//     saveTasks();
//     renderTasks();
//   }
// }

// // Clear completed tasks
// function clearCompleted() {
//   tasks = tasks.filter(task => !task.completed);
//   saveTasks();
//   renderTasks();
// }

// // Delete all tasks
// function deleteAll() {
//   const confirmDelete = confirm("Are you sure you want to delete all tasks?");
//   if (confirmDelete) {
//     tasks = [];
//     saveTasks();
//     renderTasks();
//   }
// }

// // Filter buttons
// filterButtons.forEach(button => {
//   button.addEventListener("click", () => {
//     filterButtons.forEach(btn => btn.classList.remove("active"));
//     button.classList.add("active");
//     currentFilter = button.dataset.filter;
//     renderTasks();
//   });
// });

// // Event listeners
// addTaskBtn.addEventListener("click", addTask);

// taskInput.addEventListener("keypress", function (e) {
//   if (e.key === "Enter") {
//     addTask();
//   }
// });

// clearCompletedBtn.addEventListener("click", clearCompleted);
// deleteAllBtn.addEventListener("click", deleteAll);

// // Initial render
// renderTasks();











const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = [];
let currentFilter = "all";

// 🔗 FETCH tasks from backend
function fetchTasks() {
  fetch("http://localhost:5000/todos")
    .then(res => res.json())
    .then(data => {
      tasks = data;
      renderTasks();
    })
    .catch(err => console.log(err));
}

// 📊 Update stats
function updateStats() {
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter(task => task.completed).length;
  pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}
// ✅ TOGGLE
function toggleTask(id, completed) {
  fetch(`http://localhost:5000/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed: !completed })
  })
  .then(() => fetchTasks());
}

// ✅ DELETE
function deleteTask(id) {
  fetch(`http://localhost:5000/todos/${id}`, {
    method: "DELETE"
  })
  .then(() => fetchTasks());
}

// ✅ EDIT
function editTask(id, oldText) {
  const newText = prompt("Edit your task:", oldText);

  if (newText !== null && newText.trim() !== "") {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: newText.trim() })
    })
    .then(() => fetchTasks());
  }
}
// 🎨 Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; color:#777; padding:10px;">No tasks found.</li>`;
    updateStats();
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
        <div>
          <div class="task-text ${task.completed ? "completed" : ""}">${task.text}</div>
          <div class="task-date">Due: ${task.date || "No date"}</div>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

  const checkbox = li.querySelector(".complete-checkbox");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => 
    toggleTask(task._id, task.completed)
  );

  editBtn.addEventListener("click", () => 
    editTask(task._id, task.text)
  );

  deleteBtn.addEventListener("click", () => 
    deleteTask(task._id)
  );

    taskList.appendChild(li);
  });

  updateStats();
}

// ➕ ADD task (backend me save)
function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  fetch("http://localhost:5000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text, date })
  })
  .then(res => res.json())
  .then(() => {
    fetchTasks(); // 🔥 refresh list
  });

  taskInput.value = "";
  taskDate.value = "";
}

// 🎛 Filters
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// 🎯 Event listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// 🚀 Initial load
fetchTasks();