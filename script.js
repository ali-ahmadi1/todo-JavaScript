const themeSwitcherBtn = document.getElementById("theme-toggle"); // Theme switcher
const themeIcon = document.getElementById("theme-icon"); // Theme switcher
const bodyTag = document.querySelector("body"); // Theme switcher

const todoBtn = document.querySelector("#todo-form button");
const todoInput = document.querySelector("#todo-form input");
const editBtn = document.getElementById("edit-btn");

const ul = document.getElementById("todo-list");

const filterTasks = document.getElementById("filter-div");
// Spans label -------------------------------------------
const allTasks = document.getElementById("all-tasks");
const leftTasks = document.getElementById("left-tasks");
const doneTasks = document.getElementById("done-tasks");

function main() {

	// #region Theme switcher --------------------------------------------------------
	themeSwitcherBtn.addEventListener('click', () => {
		const isDark = bodyTag.getAttribute("data-bs-theme") === "dark";
		bodyTag.setAttribute("data-bs-theme", isDark ? "light" : "dark");
		themeIcon.classList.toggle("bi-sun-fill", !isDark);
		themeIcon.classList.toggle("bi-moon-fill", isDark);
	});
	// #region Make html Elements ----------------------------------------------------
	makeHTMLElements(JSON.parse(localStorage.getItem("todos")));
	// #region Dragging tasks --------------------------------------------------------
	ul.addEventListener("dragover", (e) => {
		e.preventDefault();
		if (e.target.classList.contains("task") && !e.target.classList.contains("dragging")) {
			const draggingTask = document.querySelector(".dragging");
			const tasks = [...ul.querySelectorAll(".task")];
			const currentPos = tasks.indexOf(draggingTask);
			const newPos = tasks.indexOf(e.target);
			const referenceNode = currentPos > newPos ? e.target : e.target.nextSibling;
			ul.insertBefore(draggingTask, referenceNode);
			const todos = JSON.parse(localStorage.getItem("todos"));
			const removedTask = todos.splice(currentPos, 1);
			todos.splice(newPos, 0, removedTask[0]);
			localStorage.setItem("todos", JSON.stringify(todos));
		}
	});
	// #region Add task to localStorage ----------------------------------------------
	todoBtn.addEventListener('click', () => {
		const item = todoInput.value.trim();
		if (!item) return;
		const todos = JSON.parse(localStorage.getItem("todos") || "[]");
		const currentTask = { task: item, isDone: false };
		todos.push(currentTask);
		localStorage.setItem("todos", JSON.stringify(todos));
		makeHTMLElements([currentTask]);
		todoInput.value = "";
	});
	// #region Filter tasks ----------------------------------------------
	filterTasks.addEventListener("click", (e) => {
		const filter = e.target.getAttribute("filter");
		if (!filter) return;

		document.querySelector("#filter-div .active")?.classList.remove("active");
		e.target.classList.add("active");

		document.querySelectorAll("#todo-list .task").forEach(task => {
			task.classList.remove("d-none");
		});

		if (filter === "left-tasks") {
			document.querySelectorAll("#todo-list .task p.text-decoration-line-through").forEach(p => {
				p.closest(".task").classList.add("d-none");
			});
		} else if (filter === "done-tasks") {
			document.querySelectorAll("#todo-list .task p:not(.text-decoration-line-through)").forEach(p => {
				p.closest(".task").classList.add("d-none");
			});
		}
	});
}

function makeHTMLElements(todoArray) {
	if (!todoArray) return null;
	todoArray.forEach(todoObject => {

		// #region Create Elements -----------------------------------------------------------------------------------------------------
		const task = document.createElement("li");
		const divIcons = document.createElement("div");
		const btnEdit = document.createElement("button");
		const iEdit = document.createElement("i");
		const btnDelete = document.createElement("button");
		const iDelete = document.createElement("i");
		const divMain = document.createElement("div");
		const input = document.createElement("input");
		const p = document.createElement("p");

		// #region Add Class to elements ----------------------------------------------------------------------------------
		task.classList.add("task", "list-group-item", "list-group-item-action", "d-flex", "align-items-center", "gap-2", "flex-row-reverse");
		divIcons.classList.add("col-sm-4");
		btnEdit.classList.add("btn", "btn-sm", "btn-warning");
		iEdit.classList.add("bi", "bi-pencil-square");
		btnDelete.classList.add("btn", "btn-sm", "btn-danger", "me-2");
		iDelete.classList.add("bi", "bi-trash");
		divMain.classList.add("col-sm-8", "d-flex", "align-items-center", "gap-2");
		input.classList.add("task-checkbox", "form-check-input");
		p.classList.add("mb-0");

		// #region Set Attribute to elements ---------------------------------------------------------------------------------
		task.setAttribute("draggable", true);
		input.setAttribute("type", 'checkbox');
		divIcons.style.direction = "ltr";
		p.textContent = todoObject.task;

		if (todoObject.isDone) {
			p.classList.add("text-decoration-line-through");
			input.setAttribute("checked", "checked");
			btnEdit.classList.add("disabled");
		}

		// #region Events Elements -------------------------------------------------------------------------------------------
		task.addEventListener("dragstart", () => {
			task.classList.add("dragging");
		});

		task.addEventListener("dragend", () => {
			task.classList.remove("dragging");
		});

		btnDelete.addEventListener("click", () => {
			const currentTask = btnDelete.parentElement.parentElement;
			currentTask.classList.add('remove');
			currentIndexOfTask = [...document.querySelectorAll("#todo-list .task")].indexOf(currentTask);
			removeTask(currentIndexOfTask);
			currentTask.addEventListener("animationend", () => {
				setTimeout(() => {
					currentTask.remove();
					leftTaskUpdate();
				}, 100)
			})
		})

		btnEdit.addEventListener("click", () => {

			const currentTask = btnDelete.parentElement.parentElement;
			const currentIndexOfTask = [...document.querySelectorAll("#todo-list .task")].indexOf(currentTask);
			editTask(currentIndexOfTask);
			todoBtn.classList.add("d-none");
			editBtn.classList.remove("d-none");
			editBtn.addEventListener("click", () => {
				const todos = JSON.parse(localStorage.getItem("todos"));
				const removedTask = todos.splice(currentIndexOfTask, 1)[0];
				removedTask.task = todoInput.value;
				todos.splice(currentIndexOfTask, 0, removedTask);
				localStorage.setItem("todos", JSON.stringify(todos));
				todoBtn.classList.remove("d-none");
				editBtn.classList.add("d-none");
			})
		})

		input.addEventListener("click", () => {
			const currentTask = input.parentElement.parentElement;
			const check = input.checked;
			const currentTaskIndex = [...document.querySelectorAll("#todo-list .task")].indexOf(currentTask);
			stateTask(currentTaskIndex, check);
			p.classList.toggle("text-decoration-line-through", check);
			btnEdit.classList.toggle("disabled", check);
			leftTaskUpdate();
		})

		// #region Orderd Elements -------------------------------------------------------------------------------------------
		divMain.appendChild(input);
		divMain.appendChild(p);
		btnEdit.appendChild(iEdit);
		btnDelete.appendChild(iDelete);
		divIcons.appendChild(btnDelete);
		divIcons.appendChild(btnEdit);
		task.appendChild(divIcons);
		task.appendChild(divMain);

		document.getElementById("todo-list").appendChild(task);
	});

	leftTaskUpdate();
}

function removeTask(index) {
	const todos = JSON.parse(localStorage.getItem("todos"));
	todos.splice(index, 1);
	localStorage.setItem("todos", JSON.stringify(todos));
}

function editTask(index) {
	const todos = JSON.parse(localStorage.getItem("todos"));
	todoInput.value = todos.splice(index, 1)[0].task;
}

function stateTask(index, isComplete) {
	const todos = JSON.parse(localStorage.getItem("todos"));
	console.log(todos);
	todos[index].isDone = isComplete;
	localStorage.setItem("todos", JSON.stringify(todos));
}

function leftTaskUpdate() {
	const allTasksNum = document.querySelectorAll(
		"#todo-list li.task"
	).length

	const leftTasksNum = document.querySelectorAll(
		"#todo-list li.task p:not(.text-decoration-line-through)"
	).length;

	const doneTasksNum = allTasksNum - leftTasksNum;

	allTasks.textContent = allTasksNum;
	leftTasks.textContent = leftTasksNum;
	doneTasks.textContent = doneTasksNum;

}

window.addEventListener("DOMContentLoaded", main);