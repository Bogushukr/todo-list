const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.todos-wrapper');

const USER_ID = 1;
const BASE_URL = `https://jsonplaceholder.typicode.com/todos?userId=${USER_ID}`;


let todoItems = [];
function loadTaskState() {
  return localStorage.tasks ? JSON.parse(localStorage.getItem('tasks')) : [];
}

let tasks = loadTaskState();
class Todo {
  constructor(title) {
    this.userId = USER_ID;
    this.id = Date.now();
    this.title = title;
    this.completed = false;
  }
}
    
const createTemplate = (task, index) => {
    return `
        <div class="todo-item ${task.completed ? 'checked' : ''}">
            <div onclick="window.location.href = './todo-item.html'" class="title">${task.title}</div>
            <div class="buttons">
                <input onclick="completeItem(${index})" type="checkbox" class="btn-complete" ${task.completed ? 'checked' : ''}>
                <button onclick="deleteItem(${index})" class="btn-delete"><img class="icon" src="./bin.png" alt="Delete"></button>
            </div>
        </div>
    `
}

const filterItem = () => {
    const activeItem = tasks.length && tasks.filter(item => item.completed == false);
    const completedItem = tasks.length && tasks.filter(item => item.completed == true);
    tasks = [...activeItem, ...completedItem,];
}


async function apiGetTasks() {
    if (tasks.length === 0) {
        try {
            const response = await fetch(BASE_URL);
            const data = await response.json();
            return localStorage.setItem('tasks', JSON.stringify(data));
        } catch (error) {
            console.log('error', error);
        }
    }
}

const createTasksList = () => {
    todosWrapper.innerHTML = "";
    filterItem();
    if (tasks.length > 0) {
        tasks.forEach((item, index) => {
            todosWrapper.innerHTML += createTemplate(item, index);       
        });
        return todoItems = document.querySelectorAll('.todo-item');
    }  
}

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const completeItem = index => {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        todoItems[index].classList.add('checked');
    } else {
        todoItems[index].classList.remove('checked');
    }
    updateLocal();
    createTasksList();  
}

const deleteItem = index => {   
    todoItems[index].classList.add('deletion');
    setTimeout(() => {
        tasks.splice(index, 1);
        updateLocal();
        createTasksList();        
    }, 350)
}

// async function getUsers() {
//   try {
//     let response = await fetch('http://example.com/api/users');
//     let users = await response.json();
//     return users;
//   } catch(error) {
//     alert(error);
//   }
// }

// getUsers();

addTaskBtn.addEventListener('click', () => {
    tasks.push(new Todo(deskTaskInput.value));
    updateLocal();
    createTasksList();
    deskTaskInput.value = '';
});

(async () => {
    await apiGetTasks();
    tasks = loadTaskState();
    createTasksList();
})();