// DOM Elements
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCounter = document.getElementById('taskCounter');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Task array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize app
function init() {
    renderTasks();
    setupEventListeners();
    updateTaskCounter();
}

// Event listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// Add new task
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (!taskText) {
        alert('Please enter a task!');
        newTaskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    renderTasks();
    newTaskInput.value = '';
    newTaskInput.focus();
    updateTaskCounter();
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => {
        return task.id === id ? { ...task, completed: !task.completed } : task;
    });
    saveTasks();
    renderTasks();
    updateTaskCounter();
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCounter();
    }
}

// Clear completed tasks
function clearCompletedTasks() {
    if (confirm('Clear all completed tasks?')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCounter();
    }
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks found</p>
                <small>${
                    currentFilter === 'all' ? 'Add your first task above!' : 
                    currentFilter === 'completed' ? 'No completed tasks yet' : 
                    'All tasks are completed!'
                }</small>
            </div>
        `;
        return;
    }

    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => toggleTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(taskItem);
    });
}

// Update task counter
function updateTaskCounter() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    taskCounter.textContent = `${completed} of ${total} tasks completed`;
}

// Initialize app
init();