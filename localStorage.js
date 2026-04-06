// LocalStorage
export const STORAGE_KEY = 'todos-app'; // ключ для отдельного списка в LS

export const storage = {
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