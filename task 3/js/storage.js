// storage.js - Mengelola penyimpanan data ke localStorage
const Storage = (function() {
    // Key untuk localStorage
    const STORAGE_KEY = 'todo_list_app';
    
    /**
     * Mengambil todos dari localStorage
     * @returns {Array} Array of todo objects
     */
    function getTodos() {
        try {
            const todosJSON = localStorage.getItem(STORAGE_KEY);
            return todosJSON ? JSON.parse(todosJSON) : [];
        } catch (error) {
            console.error('Error membaca todos dari localStorage:', error);
            return [];
        }
    }
    
    /**
     * Menyimpan todos ke localStorage
     * @param {Array} todos - Array of todo objects
     */
    function saveTodos(todos) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Error menyimpan todos ke localStorage:', error);
        }
    }
    
    /**
     * Menghapus semua todos dari localStorage
     */
    function clearTodos() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error menghapus todos dari localStorage:', error);
        }
    }
    
    // Public API
    return {
        getTodos,
        saveTodos,
        clearTodos
    };
})();