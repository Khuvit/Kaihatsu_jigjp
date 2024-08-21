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

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.addEventListener('change', handleTaskCompletion);

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(document.createTextNode(taskText));
    document.getElementById('todoList').appendChild(taskItem);

    taskInput.value = '';
}

function handleTaskCompletion(event) {
    if (event.target.checked) {
        const taskItem = event.target.parentElement;
        if (!taskItem.classList.contains('completed')) {
            taskItem.classList.add('completed');
            changeRandomBlockColor();
        }
    }
}

function changeRandomBlockColor() {
    const blocks = document.querySelectorAll('.grid-item');
    const darkBlueBlocks = Array.from(blocks).filter(block => !block.classList.contains('white'));
    if (darkBlueBlocks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * darkBlueBlocks.length);
    darkBlueBlocks[randomIndex].classList.add('white');
}
