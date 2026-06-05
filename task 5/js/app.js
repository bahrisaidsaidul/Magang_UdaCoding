// app.js - Inisialisasi aplikasi dan event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi komponen
    initApp();
});

/**
 * Inisialisasi aplikasi
 */
function initApp() {
    // Load todos dari storage
    TodoManager.loadTodos();
    
    // Update cuaca
    const weatherWidget = document.getElementById('weatherWidget');
    if (weatherWidget) {
        WeatherAPI.updateWeatherDisplay(weatherWidget);
        // Update cuaca setiap 10 menit
        setInterval(() => {
            WeatherAPI.updateWeatherDisplay(weatherWidget);
        }, 10 * 60 * 1000);
    }
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup semua event listeners
 */
function setupEventListeners() {
    // Input todo - tambah dengan Enter
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAddTodo();
            }
        });
    }
    
    // Tombol tambah
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', handleAddTodo);
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            TodoManager.setFilter(filter);
        });
    });
    
    // Clear completed
    const clearCompleted = document.getElementById('clearCompleted');
    if (clearCompleted) {
        clearCompleted.addEventListener('click', function() {
            TodoManager.clearCompleted();
        });
    }
    
    // Edit dialog
    setupEditDialog();
    
    // Global click untuk menutup dialog
    window.addEventListener('click', function(e) {
        const dialog = document.getElementById('editDialog');
        if (e.target === dialog) {
            TodoManager.hideEditDialog();
        }
    });
    
    // Escape key untuk menutup dialog
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            TodoManager.hideEditDialog();
        }
    });
}

/**
 * Handle tambah todo
 */
function handleAddTodo() {
    const todoInput = document.getElementById('todoInput');
    const text = todoInput.value.trim();
    
    if (text) {
        const success = TodoManager.addTodo(text);
        if (success) {
            todoInput.value = '';
            todoInput.focus();
        }
    }
}

/**
 * Setup dialog edit
 */
function setupEditDialog() {
    const saveEdit = document.getElementById('saveEdit');
    const cancelEdit = document.getElementById('cancelEdit');
    const editInput = document.getElementById('editInput');
    
    if (saveEdit) {
        saveEdit.addEventListener('click', function() {
            TodoManager.handleSaveEdit();
        });
    }
    
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            TodoManager.hideEditDialog();
        });
    }
    
    if (editInput) {
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                TodoManager.handleSaveEdit();
            }
        });
    }
}

/**
 * Catatan: Ganti API_KEY di weatherAPI.js dengan key Anda sendiri
 * Dapatkan API key gratis di: https://openweathermap.org/api
 */