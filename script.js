const taskForm = document.getElementById("form");
const taskInput = document.getElementById("task");
const taskItBtn = taskForm.querySelector("button");
const taskList = document.getElementById("task-list");
const clearTaskBtn = document.getElementById("clear");
const filterOpt = document.getElementById("filter-opt");
isEditMode = false;

function showTasks(e) {
  const tasksFromLocalStr = getTasksFromStr();
  tasksFromLocalStr.forEach((task) => addTaskToDom(task));
  checkUi();
}

function onTaskIt(e) {
  e.preventDefault();

  const taskText = taskInput.value;

  if (taskText === "") {
    alert("Please add a task first!");
    return;
  } else {
    if (checkDuplicateTask(taskText)) {
      alert("That task already exists");
      return;
    }
  }

  if (isEditMode) {
    const taskToEdit = taskList.querySelector(".edit-mode");

    removeTaskFromStorage(taskToEdit.textContent);
    taskToEdit.classList.remove("edit-remocve");
    taskToEdit.remove();
    isEditMode = false;
  }

  addTaskToDom(taskText);

  addTaskToLocalStr(taskText);

  taskInput.value = "";

  checkUi();
}

function addTaskToDom(task) {
  const taskListItem = document.createElement("li");
  taskListItem.textContent = task;

  const newDeleteBtn = deleteBtn("delete-btn");
  taskListItem.appendChild(newDeleteBtn);
  taskList.appendChild(taskListItem);
}

function addTaskToLocalStr(task) {
  const tasksFromLocalStr = getTasksFromStr();

  tasksFromLocalStr.push(task);

  localStorage.setItem("items", JSON.stringify(tasksFromLocalStr));
}

function getTasksFromStr() {
  let tasksFromLocalStr;

  if (localStorage.getItem("items") === null) {
    tasksFromLocalStr = [];
  } else {
    tasksFromLocalStr = JSON.parse(localStorage.getItem("items"));
  }

  return tasksFromLocalStr;
}

function deleteBtn(classes) {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList = classes;

  const newDeleteIcon = deleteIcon("fa-solid fa-trash-can");

  deleteBtn.appendChild(newDeleteIcon);
  return deleteBtn;
}

function deleteIcon(classes) {
  const deleteIcon = document.createElement("i");
  deleteIcon.classList = classes;

  return deleteIcon;
}

function OnClickTask(e) {
  if (e.target.parentElement.classList.contains("delete-btn")) {
    deleteTask(e.target.parentElement.parentElement);
  } else {
    setTaskToEdit(e.target);
  }
}

function checkDuplicateTask(task) {
  const tasksFromLocalStr = getTasksFromStr();
  return tasksFromLocalStr.includes(task);
}

function setTaskToEdit(task) {
  isEditMode = true;

  taskList
    .querySelectorAll("li")
    .forEach((t) => t.classList.remove("edit-mode"));

  task.classList.add("edit-mode");
  taskItBtn.style.backgroundColor = "yellow";
  taskItBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> EditIt';

  taskInput.value = task.textContent;
}

function deleteTask(task) {
  task.remove();

  removeTaskFromStorage(task.textContent);

  checkUi();
}

function removeTaskFromStorage(task) {
  let tasksFromLocalStr = getTasksFromStr();

  tasksFromLocalStr = tasksFromLocalStr.filter((t) => t !== task);

  localStorage.setItem("items", JSON.stringify(tasksFromLocalStr));
}

function clearAllTasks(e) {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  localStorage.removeItem("items");

  checkUi();
}

function filterTask(e) {
  const allTaskArray = taskList.querySelectorAll("li");
  const filter = e.target.value.toLowerCase();

  allTaskArray.forEach(function (tasks) {
    const task = tasks.firstChild.textContent.toLowerCase();
    if (task.indexOf(filter) != -1) {
      tasks.style.display = "flex";
    } else {
      tasks.style.display = "none";
    }
  });
}

function checkUi() {
  taskInput.value = "";

  const ListTasks = taskList.querySelectorAll("li");

  if (ListTasks.length === 0) {
    filterOpt.style.display = "none";
    clearTaskBtn.style.display = "none";
  } else {
    filterOpt.style.display = "flex";
    clearTaskBtn.style.display = "flex";
  }

  taskItBtn.innerHTML = '<i class="fa-solid fa-notes-medical"></i> TaskIt';
  taskItBtn.style.backgroundColor = "greenyellow";

  isEditMode = false;
}

function inti() {
  taskForm.addEventListener("submit", onTaskIt);
  taskList.addEventListener("click", OnClickTask);
  clearTaskBtn.addEventListener("click", clearAllTasks);
  filterOpt.addEventListener("input", filterTask);
  document.addEventListener("DOMContentLoaded", showTasks);

  checkUi();
}

inti();
