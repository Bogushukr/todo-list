const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.todos-wrapper');

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let todoItems = [];

function Task(description) {
    this.userId = "";
    this.id = "";
    this.title = description;
    this.completed = false;
}

const apiGetTasks = () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => 
    localStorage.setItem('tasks', JSON.stringify(data)))
}


const createTemplate = (task, index) => {
    return `
        <div class="todo-item ${task.completed ? 'checked' : ''}">
            <div class="description">${task.title}</div>
            <div class="buttons">
                <input onclick="completeItem(${index})" type="checkbox" class="btn-complete" ${task.completed ? 'checked' : ''}>
                <button onclick="deleteItem(${index})" class="btn-delete"><img src="/delete.svg" alt="" width="16" height="16"></button>
            </div>
        </div>
    `
}

// const filterItem = () => {
//     const activeItem = tasks.length && tasks.filter(item => item.completed == false);
//     const completedItem = tasks.length && tasks.filter(item => item.completed == true);
//     tasks = [...activeItem, ...completedItem];

// }

const createTasksList = () => {
    todosWrapper.innerHTML = "";
    // filterItem();
    apiGetTasks();
    if (tasks.length > 0) {
        tasks.forEach((item, index) => {
            todosWrapper.innerHTML += createTemplate(item, index);
        });
        todoItems = document.querySelectorAll('.todo-item');
    }
}

createTasksList();

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
    todoItems[index].classList.add('delition');
    setTimeout(() => {
        tasks.splice(index, 1);
        updateLocal();
        createTasksList();
    }, 350)
}

addTaskBtn.addEventListener('click', () => {
    tasks.push(new Task(deskTaskInput.value));
    updateLocal();
    createTasksList();
    deskTaskInput.value = '';
})






// class ApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   async fetchImages() {
//     const url = BASE_URL;
//       const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
    
//     }
//     const result = await response.json();
//     console.log(result);
//     this.incrementPage();
//     return await Promise.resolve(result.hits);
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }

// const apiImg = new ApiService();

// function onSearch(e) {
//   e.preventDefault();
//   clearGallery();
//   const inputQuery = e.currentTarget.elements.query.value;
//   apiImg.query = inputQuery.trim();

//   loadBtn.show();
//   apiImg.resetPage();
//   clearGallery();
//   fetchImgs();
//   e.currentTarget.reset();

//   scrollImg(e);
// }

// async function fetchImgs() {
//   try {
//     const img = await apiImg.fetchImages();
//     loadBtn.disable();
//     preloader.show();
//     renderImgs(img);
//   } catch (error) {
//     console.log(error);
//     onError();
//   }

//   loadBtn.enable();
//   preloader.hide();
// }

