// получнеие общей статы по кол-ву задач
export function getStats(todos) {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const active = total - done;

    return { total, done, active };
}