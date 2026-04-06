const form = document.querySelector('.todo-form');
const input = document.querySelector('#input');
const list = document.querySelector('.list');
const showAllTasksBtn = document.querySelector('.btnAllActiveTasks');
const doneBtn = document.querySelector('.btnDoneTasks');

document.addEventListener('DOMContentLoaded', () => {
    input.focus();
}); // фокус сразу на инпут


const STORAGE_KEY = 'todos-app'; // ключ для отдельного списка в LS

// LocalStorage
const storage = {
    load(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Ошибка загрузки ${key}:`, error);
            localStorage.removeItem(key);
            return defaultValue;
        }
    },

    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Ошибка сохранения ${key}:`, error);
        }
    }
};

let todos = storage.load(STORAGE_KEY); // загружаем список задач


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

    storage.save(STORAGE_KEY, todos);
    render();
});


// render списка тасок
function render() {
    list.innerHTML = '';

    const filtered = getFilteredTodos();

    const fragment = document.createDocumentFragment(); // хоть и излишне, но ради интереса буду использовать фрагмент (для оптимизации производительности)

    filtered.forEach(todo => {
        const task = document.createElement('li');
        task.classList.add('task-item');

        task.dataset.id = todo.id;

        if (todo.completed) {
            task.classList.add('done');
        }

        // так нельзя -> привет от прививки))))
        // li.innerHTML = `
        //     <strong>${todo.text}</strong>
        //     <button class="delete-btn">Удалить</button>
        // `; 

        // безопаснее создать так:
        const strong = document.createElement('strong');
        strong.textContent = todo.text;

        const button = document.createElement('button');
        button.classList.add('delete-btn');
        button.textContent = 'Удалить';

        task.append(strong, button);

        fragment.appendChild(task); // кладем снаала в фрагмент
    });
    list.appendChild(fragment); // а потом из ффрагмента за один раз в список

    updateButtons(); // обновляем кол-во задач в счетчиках внутри кнопок
}


// удаление тасок
list.addEventListener('click', function (e) {
    const todoElement = e.target.closest('li');
    if (!todoElement) return;

    const todoId = Number(todoElement.dataset.id);
    const todoItem = todos.find(t => t.id === todoId);
    if (!todoItem) return;;

    if (e.target.classList.contains('delete-btn')) {
        todos = todos.filter(t => t.id !== todoId);
        storage.save(STORAGE_KEY, todos);
        render();
        return;
    }

    todoItem.completed = !todoItem.completed;
    storage.save(STORAGE_KEY, todos);
    render();
});

// фильтры для статы
const FILTER_OPTIONS = {
    ALL: 'all',
    ACTIVE: 'active',
    DONE: 'done'
};

let currentFilter = FILTER_OPTIONS.ALL;

render(); // при старте сразу показываем ui

// фильтрация списка кнопками
showAllTasksBtn.addEventListener('click', function () {
    if (currentFilter === FILTER_OPTIONS.ALL) {
        currentFilter = FILTER_OPTIONS.ACTIVE;
    } else {
        currentFilter = FILTER_OPTIONS.ALL;
    }

    render();
});

doneBtn.addEventListener('click', function () {
    currentFilter = FILTER_OPTIONS.DONE;
    render();
});

function getFilteredTodos() {
    if (currentFilter === FILTER_OPTIONS.ACTIVE) {
        return todos.filter(t => !t.completed);
    }

    if (currentFilter === FILTER_OPTIONS.DONE) {
        return todos.filter(t => t.completed);
    }

    return todos;
}

// получнеие общей статы по кол-ву задач
function getStats() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const active = total - done;

    return { total, done, active };
}


// кол-во задач в кнопках
function updateButtons() {
    const { total, done, active } = getStats();

    if (currentFilter === FILTER_OPTIONS.ALL) {
        showAllTasksBtn.textContent = `Все задачи: ${total}`;
    } else {
        showAllTasksBtn.textContent = `Надо выполнить: ${active}`;
    }

    doneBtn.textContent = `Выполнено: ${done} / ${total}`;

    showAllTasksBtn.classList.remove('active');
    doneBtn.classList.remove('active');

    if (currentFilter === FILTER_OPTIONS.DONE) {
        doneBtn.classList.add('active');
    } else {
        showAllTasksBtn.classList.add('active');
    }
}