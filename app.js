// Load existing tasks or initialize empty
let tasks = JSON.parse(localStorage.getItem('tasks2025')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const upcomingTaskEl = document.getElementById('upcomingTask');
const progressBar = document.getElementById('progressBar');
const filterButtons = document.querySelectorAll('#filterPanel button');
const quote = document.getElementById('quote');

// Motivational quotes array
const quotesArr = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Start where you are. Use what you have. Do what you can.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Small wins build big results!"
];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks2025', JSON.stringify(tasks));
}

// Render statistics, progress bar, and motivational quote
function renderStats() {
  totalTasksEl.textContent = `Total Tasks: ${tasks.length}`;
  completedTasksEl.textContent = `Completed: ${tasks.filter(task => task.completed).length}`;

  const upcoming = tasks
    .filter(task => !task.completed && task.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  upcomingTaskEl.textContent = upcoming ? `Next Due: ${upcoming.name} (${upcoming.date})` : 'Next Due: --';

  renderTimeline();

  // Rotate motivational quote
  quote.textContent = quotesArr[Math.floor(Math.random() * quotesArr.length)];
}

// Render the progress bar fill
function renderTimeline() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.innerHTML = `<div class="progress-fill" style="width: ${percent}%;"></div>`;
}

// Render tasks list filtered and interactive
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks;

  switch (currentFilter) {
    case 'completed':
      filteredTasks = tasks.filter(task => task.completed);
      break;
    case 'pending':
      filteredTasks = tasks.filter(task => !task.completed);
      break;
    default:
      filteredTasks = tasks;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');

    // Checkbox to toggle complete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed || false;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
      renderStats();
    });
    li.appendChild(checkbox);

    // Task name with due date
    const taskText = document.createElement('span');
    taskText.textContent = `${task.name} - Due: ${task.date}`;
    if (task.completed) taskText.classList.add('completed');
    li.appendChild(taskText);

    // Subject tag optional
    if (task.subject) {
      const subjectSpan = document.createElement('span');
      subjectSpan.textContent = task.subject;
      subjectSpan.className = 'subject';
      li.appendChild(subjectSpan);
    }

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    delBtn.title = 'Delete task';
    delBtn.addEventListener('click', () => {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      renderTasks();
      renderStats();
    });
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

// Handles filter button clicks and toggling active styles
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.textContent.toLowerCase();

    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    renderTasks();
  });
});

// Submission handler to add new task
taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const taskName = document.getElementById('taskName').value.trim();
  const subjectName = document.getElementById('subjectName').value.trim();
  const taskDate = document.getElementById('taskDate').value;

  if (!taskName || !taskDate) return;

  tasks.push({
    name: taskName,
    subject: subjectName,
    date: taskDate,
    completed: false
  });

  saveTasks();
  renderTasks();
  renderStats();

  taskForm.reset();
});

// Initialize page with default filter and render
document.addEventListener('DOMContentLoaded', () => {
  filterButtons.forEach(btn => {
    if (btn.textContent.toLowerCase() === currentFilter) btn.classList.add('active');
  });

  renderTasks();
  renderStats();
});
