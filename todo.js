const form = document.querySelector('.todo-form');
const input = document.querySelector('#input');
const list = document.querySelector('.list');
const showAllTasksBtn = document.querySelector('.btnAllActiveTasks');
const doneBtn = document.querySelector('.btnDoneTasks');

window.addEventListener('load', () => {
    input.focus();
}); // фокус сразу на инпут


const STORAGE_KEY = 'todos-app'; // ключ для отдельного списока
let todos = loadTodos(); // список задач
let currentFilter = "all"; // all | active | done


render(); // при старте сразу показываем ui

// LocalStorage
function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}


// Добавление и сохранение таски
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    const newTodo = {
        id: Date.now(),
        text: title,
        completed: false
    };

    todos.push(newTodo);
    input.value = '';

    saveTodos();
    render();
});


// render списка тасок
function render() {
    list.innerHTML = '';

    const filtered = getFilteredTodos();

    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('task-item');

        li.dataset.id = todo.id;

        if (todo.completed) {
            li.classList.add('done');
        }

        li.innerHTML = `
            <strong>${todo.text}</strong>
            <button class="delete-btn">Удалить</button>
        `;

        list.appendChild(li);
    });

    updateButtons();
}


// CLICK (delete / toggle)
list.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;

    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    if (e.target.classList.contains('delete-btn')) {
        todos = todos.filter(t => t.id !== id);
        render();
        return;
    }

    todo.completed = !todo.completed;
    render();
});


// фильрация списка кнопками
showAllTasksBtn.addEventListener('click', function () {
    if (currentFilter === 'all') {
        currentFilter = 'active';
    } else {
        currentFilter = 'all';
    }

    render();
});

doneBtn.addEventListener('click', function () {
    currentFilter = 'done';
    render();
});

function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(t => !t.completed);
    }

    if (currentFilter === 'done') {
        return todos.filter(t => t.completed);
    }

    return todos;
}


// получнеие статы
function getStats() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const active = total - done;

    return { total, done, active };
}


// кол-во задач в кнопках
function updateButtons() {
    const { total, done, active } = getStats();

    if (currentFilter === 'all') {
        showAllTasksBtn.textContent = `Все задачи: ${total}`;
    } else {
        showAllTasksBtn.textContent = `Надо выполнить: ${active}`;
    }

    doneBtn.textContent = `Выполнено: ${done} / ${total}`;

    showAllTasksBtn.classList.remove('active');
    doneBtn.classList.remove('active');

    if (currentFilter === 'done') {
        doneBtn.classList.add('active');
    } else {
        showAllTasksBtn.classList.add('active');
    }
}