const addTaskBtn = document.getElementById('add-task-btn');
const saveTitleBtn = document.getElementById('save-title-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.todos-wrapper');


let todoItems = [];

function loadTaskState() {
  return localStorage.tasks ? JSON.parse(localStorage.getItem('tasks')) : [];
}

let tasks = loadTaskState();

class Todo {
  constructor(title) {
    this.userId = 1;
    this.id = Date.now();
    this.title = title;
    this.completed = false;
  }
}

class Api {
  constructor() {
    this.userID = 1;
    this.baseUrl = `https://jsonplaceholder.typicode.com/todos`;
  }

  async getItems() {
    return await fetch(`${this.baseUrl}?userId=${this.userID}`);
  }

  async addItem(data) {
    return await fetch(`${this.baseUrl}?userId=${this.userID}`, {
      method: "POST",
      body: data
    });
  }

  async updateItem(id, data) {
    return await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: data
    });
  }

  async removeItem(id) {
    return await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }
}

const api = new Api();

const createTemplate = (task, index) => {   
    return `
        <div class="todo-item ${task.completed ? 'checked' : ''}">
            <div onclick="title(${index})" class="title">${task.title}</div>
            <div class="buttons">
                <input onclick="updateTodo(${index})" type="checkbox" class="btn-complete" ${task.completed ? 'checked' : ''}>
                <button onclick="removeTodo(${index})" class="btn-delete"><img class="icon" src="./bin.png" alt="Delete"></button>
            </div>
        </div>
    `
}
// window.location.href = './todo-item.html'
const filterItem = () => {
    const activeItem = tasks.length && tasks.filter(item => item.completed == false);
    const completedItem = tasks.length && tasks.filter(item => item.completed == true);
    tasks = [...activeItem, ...completedItem,];
}

const getTodo = async () => {
    if (tasks.length === 0) {
      try {
        const response = await api.getItems();
        console.log('status: ',response.status, "Successfully connected");
        const data = await response.json();
        return localStorage.setItem('tasks', JSON.stringify(data));    
      } catch (error) {
        console.log('error', error);
      }
  }
}

const createTodoList = () => {
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

const updateTodo = async (index) => {
  try {
    tasks[index].completed = !tasks[index].completed
    const id = tasks[index].id;
    const data = tasks[index].completed;
    const response = await api.removeItem(id, data);
    console.log('status: ', response.status, `Task id:${id} update successfully`);
      if (tasks[index].completed) {
        todoItems[index].classList.add('checked');
        } else {
        todoItems[index].classList.remove('checked');
    }
    } catch (error) {
        console.log('error', error);
  }
    updateLocal();
    createTodoList();
}

const removeTodo = async (index) => {
  try {
    todoItems[index].classList.add('deletion');
    tasks.splice(index, 1);
    const id = await tasks[index].id;
    const response = await api.removeItem(id);
    console.log('status: ', response.status, `Task id:${id} delete successfully`);
  } catch (error) {
    console.log('error', error);
  }
    updateLocal();
    createTodoList();       
      
}

const title = (index) => {
      
  console.log(index);
}

addTaskBtn.addEventListener('click', async () => {
    try {
      const data = await new Todo;
      const response = await api.addItem(data);
      console.log('status: ', response.status, `Added task id:${data.id} successfully`);
      tasks.push(new Todo(deskTaskInput.value));
      } catch (error) {
        console.log('error', error);
      }
    updateLocal();
    createTodoList();
    deskTaskInput.value = '';
});

(async () => {
    await getTodo();
    tasks = loadTaskState();
    createTodoList();
})();

