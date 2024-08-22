document.addEventListener("DOMContentLoaded", () => {
    const currentDateElement = document.getElementById("currentDate");
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    currentDateElement.textContent = formattedDate;
});

document.addEventListener("DOMContentLoaded", () => {
    const currentDateElement = document.getElementById("currentDate");
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    currentDateElement.textContent = formattedDate;
});

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskElement(taskText, false);
    document.getElementById('todoList').appendChild(taskItem);

    saveTasks();
    taskInput.value = '';
    saveGridState();
}

function createTaskElement(taskText, isCompleted) {
    const taskItem = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = isCompleted;
    taskCheckbox.addEventListener('change', handleTaskCompletion);

    if (isCompleted) {
        taskItem.classList.add('completed');
    }

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(document.createTextNode(taskText));
    return taskItem;
}

function handleTaskCompletion(event) {
    const taskItem = event.target.parentElement;
    if (event.target.checked) {
        if (!taskItem.classList.contains('completed')) {
            taskItem.classList.add('completed');
            changeRandomBlockColor();
        }
    } else {
        taskItem.classList.remove('completed');
    }
    saveTasks();
    saveGridState();
}

function changeRandomBlockColor() {
    const starBlocks = document.querySelectorAll('.grid-item[data-star="true"]');
    const randomBlock = starBlocks[Math.floor(Math.random() * starBlocks.length)];
    randomBlock.style.backgroundColor = 'yellow'; // Change to desired color or style
}

async function loadTasks() {
    const response = await fetch('/loadTasks');
    const tasks = await response.json();
    console.log('Loaded tasks:', tasks);
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        document.getElementById('todoList').appendChild(taskItem);
    });

    loadGridState();
    updateStarBlocks();
}

function loadGridState() {
    const gridState = JSON.parse(localStorage.getItem('gridState')) || [];
    gridState.forEach(state => {
        const item = document.querySelector(`.grid-item[data-id="${state.id}"]`);
        if (item) {
            item.innerHTML = state.content;
        }
    });
}

function updateStarBlocks() {
    document.querySelectorAll('.grid-item[data-star="true"]').forEach(item => {
        item.style.backgroundColor = 'yellow'; // Change to desired color or style
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todoList li').forEach(taskItem => {
        const taskText = taskItem.textContent;
        const isCompleted = taskItem.querySelector('input').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveGridState() {
    const gridState = [];
    document.querySelectorAll('.grid-item[data-id]').forEach(item => {
        gridState.push({ id: item.getAttribute('data-id'), content: item.innerHTML });
    });
    localStorage.setItem('gridState', JSON.stringify(gridState));
}