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
}

function changeRandomBlockColor() {
    const blocks = document.querySelectorAll('.grid-item');
    const darkBlueBlocks = Array.from(blocks).filter(block => !block.classList.contains('white'));
    if (darkBlueBlocks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * darkBlueBlocks.length);
    darkBlueBlocks[randomIndex].classList.add('white');
}

async function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todoList li').forEach(taskItem => {
        const taskText = taskItem.textContent;
        const isCompleted = taskItem.querySelector('input').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    console.log('Saving tasks:', tasks);
    await fetch('/saveTasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
    });
}

async function loadTasks() {
    const response = await fetch('/loadTasks');
    const tasks = await response.json();
    console.log('Loaded tasks:', tasks);
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        document.getElementById('todoList').appendChild(taskItem);
    });
}

function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}