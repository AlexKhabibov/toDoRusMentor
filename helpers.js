export const FILTER_OPTIONS = {
    ALL: 'all',
    ACTIVE: 'active',
    DONE: 'done'
};

// фильтрация задач
export function getFilteredTodos(todos, currentFilter, FILTER_OPTIONS) {
    if (currentFilter === FILTER_OPTIONS.ACTIVE) {
        return todos.filter(t => !t.completed);
    }

    if (currentFilter === FILTER_OPTIONS.DONE) {
        return todos.filter(t => t.completed);
    }

    return todos;
}