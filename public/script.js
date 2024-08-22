document.addEventListener("DOMContentLoaded", () => {
    const currentDateElement = document.getElementById("currentDate");
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    currentDateElement.textContent = formattedDate;
    saveCurrentDate();
    checkDateAndClearTasks();
    loadTasks();
    loadGridState();
    updateStarBlocks();
});

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
    }
    saveTasks();
    saveGridState();
    returnToOriginal();
}

function saveCurrentDate() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    localStorage.setItem('currentDate', currentDate);
}

function checkDateAndClearTasks() {
    const savedDate = localStorage.getItem('currentDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (savedDate !== currentDate) {
        clearTasks();
        saveCurrentDate();
    }
}
function changeRandomBlockColor() {
    checkReturnOriginal();
    const starBlocks = document.querySelectorAll('.grid-item[data-star="true"]:not(.white)');
    const randomBlock = starBlocks[Math.floor(Math.random() * starBlocks.length)];
    randomBlock.classList.add('white');
}

async function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('Loaded tasks from local storage:', tasks);
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        document.getElementById('todoList').appendChild(taskItem);
    });
    loadGridState();
    updateStarBlocks();
}

function loadGridState() {
    try {
        // Load grid state from local storage
        const gridState = JSON.parse(localStorage.getItem('gridState')) || [];
        console.log('Loaded grid state from local storage:', gridState);

        // Update the DOM with the loaded grid state
        gridState.forEach(state => {
            const item = document.querySelector(`.grid-item[data-id="${state.id}"]`);
            if (item) {
                item.innerHTML = state.content;
                if (state.isWhite) {
                    item.classList.add('white');
                } else {
                    item.classList.remove('white');
                }
                console.log(`Updated grid item with id ${state.id}, content: ${state.content}, isWhite: ${state.isWhite}`);
            } else {
                console.warn(`Grid item with id ${state.id} not found`);
            }
        });
    } catch (error) {
        console.error('Error loading grid state:', error);
    }
}
//mae no sousa de check sareta ka wo kakunin shite nai.
function updateStarBlocks() {
    const starBlocks = JSON.parse(localStorage.getItem('starBlocks')) || [];
    console.log('Loaded star blocks from local storage:', starBlocks);//koko no load ni hannou ga nai
    starBlocks.forEach(block => {
        const item = document.querySelector(`.grid-item[data-star="true"]`);
        if (item) {
            item.classList.add('white');
        }
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todoList li').forEach(taskItem => {
        const taskText = taskItem.textContent;
        const isCompleted = taskItem.querySelector('input').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    console.log(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveGridState() {
    try {
        const gridState = [];
        document.querySelectorAll('.grid-item').forEach(item => {
            const id = item.getAttribute('data-id');
            const content = item.innerHTML;
            const isWhite = item.classList.contains('white');
            if (id) {
                gridState.push({ id, content, isWhite });
            } else {
                console.warn('Grid item without data-id found:', item);
            }
        });
        console.log('Saving grid state to local storage:', gridState);
        localStorage.setItem('gridState', JSON.stringify(gridState));
    } catch (error) {
        console.error('Error saving grid state:', error);
    }
}

function checkReturnOriginal() {
    const starBlocks = document.querySelectorAll('.grid-item[data-star="true"]:not(.white)');
    if (starBlocks.length === 0) {
        const starBlocks = document.querySelectorAll('.grid-item[data-star="true"]');
        starBlocks.forEach(block => { block.classList.remove('white') });
        localStorage.setItem('gridState', "");
    }
}

function clearTasks() {
    localStorage.removeItem('tasksByDate'); // Clear tasks from local storage
    document.getElementById('todoList').innerHTML = ''; // Clear tasks from the DOM
    console.log('Tasks cleared for the new day');
}