const theme = document.getElementById("theme-toggle");
const body = document.querySelector("body");
const themeToggle = document.getElementById("theme-toggle");
const todoBtn = document.querySelector("#todo-form button");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");




function changeTheme(){
	let bsTheme = document.body.getAttribute("data-bs-theme");
	if(bsTheme == "light" || !bsTheme){
		body.setAttribute('data-bs-theme', 'dark');
		themeToggle.innerText = "☀ حالت روز ";
	}else{
		body.removeAttribute('data-bs-theme');
		themeToggle.innerText = "🌙 حالت شب ";
	}
}

function addTask(){
	event.preventDefault();
	const todoInput = document.getElementById("todo-input").value;
	if(todoInput.length >= 2){
		todoList.insertAdjacentHTML('beforeend',`
		<li class="task list-group-item list-group-item-action d-flex align-items-center gap-2">
			<input class="task-checkbox form-check-input" type="checkbox" onchange="addToLocalStorage();textDecorationLineThrough()"/>
			<p class="mb-0">${todoInput}</p>
		</li>
	`);
	textDecorationLineThrough();
	addToLocalStorage();
	}else{
		window.alert("طول تسک باید بیشتر از دو حرف باشد");
	}
}

function addToLocalStorage(){
	const todoItems = document.querySelectorAll("#todo-list li p");
	const checkInputs = document.querySelectorAll("#todo-list li input");
	const todoItemsArray = Array.from(todoItems).map(item => item.textContent.trim());
	const checkInputsArray = Array.from(checkInputs).map(item => item.checked);
	let todoList = [];
	for(let i=0; i <todoItemsArray.length;i++){
		var newTodo = {
			task: todoItemsArray[i],
			done: checkInputsArray[i]
		}
	todoList.push(newTodo);
	}
	localStorage.setItem('todo',JSON.stringify(todoList));
	document.getElementById("todo-input").value = "";
	
}

function readLocalStorage(){
	const dataLS = localStorage.getItem('todo');
	if(dataLS){
		JSON.parse(dataLS).forEach(todo => {
			todoList.insertAdjacentHTML('beforeend',`
			<li class="task list-group-item list-group-item-action d-flex align-items-center gap-2">
				<input class="task-checkbox form-check-input" ${todo.done ? "checked" : ""} type="checkbox" onchange="addToLocalStorage();textDecorationLineThrough()"/>
				<p class="mb-0">${todo.task}</p>
			</li>`)
			})
		}
	textDecorationLineThrough();
}

function textDecorationLineThrough(){
	const taskPs = document.querySelectorAll(".task-checkbox");
	taskPs.forEach(taskP => {
		if(taskP.checked){
			taskP.nextElementSibling.classList.add("text-decoration-line-through");
			taskP.parentElement.classList.add("list-group-item-info");
			
		}else{
			taskP.nextElementSibling.classList.remove("text-decoration-line-through");
			taskP.parentElement.classList.remove("list-group-item-info");
			
		}
	})
}

function main(){
	readLocalStorage();
	theme.addEventListener('click',changeTheme);
	todoBtn.addEventListener('click',addTask);
}



window.addEventListener("DOMContentLoaded",main);