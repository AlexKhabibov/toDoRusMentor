export const form = document.querySelector('.todo-form');
export const input = document.querySelector('#input');
export const list = document.querySelector('.list');
export const showAllTasksBtn = document.querySelector('.btnAllActiveTasks');
export const doneBtn = document.querySelector('.btnDoneTasks');

// очитска списка
export function clearList(list) {
    list.innerHTML = '';
}

// создание одного элемнета списка
export function createTodoElement(todo) {
    const task = document.createElement('li');
    task.classList.add('task-item');
    task.dataset.id = todo.id;

    if (todo.completed) {
        task.classList.add('done');
    }

    const strong = document.createElement('strong');
    strong.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('delete-btn');
    button.textContent = 'Удалить';

    task.append(strong, button);

    return task;
}

// создание списка из фрагмента
export function createTodoElements(todos) {
    const fragment = document.createDocumentFragment();

    todos.forEach(todo => {
        fragment.appendChild(createTodoElement(todo));
    });

    list.appendChild(fragment);
}

// кол-во задач в кнопках
export function updateButtonsStats({
    stats,
    currentFilter,
    FILTER_OPTIONS,
    showAllTasksBtn,
    doneBtn
}) {
    const { total, done, active } = stats;

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
}; 