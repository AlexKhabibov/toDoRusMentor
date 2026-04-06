import { storage, STORAGE_KEY } from './localStorage.js'
import {
    form,
    input,
    list,
    showAllTasksBtn,
    doneBtn,
    clearList,
    createTodoElements,
    updateButtonsStats
} from './ui.js';
import { FILTER_OPTIONS, getFilteredTodos } from './helpers.js';
import { getStats } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
    input.focus();
}); // фокус сразу на инпут

let currentFilter = FILTER_OPTIONS.ALL;

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
    clearList(list);

    const filtered = getFilteredTodos(todos, currentFilter, FILTER_OPTIONS);

    createTodoElements(filtered);

    updateButtonsStats({
        stats: getStats(todos),
        currentFilter,
        FILTER_OPTIONS,
        showAllTasksBtn,
        doneBtn
    });
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