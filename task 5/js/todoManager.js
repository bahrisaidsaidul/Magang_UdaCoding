// todoManager.js - Mengelola operasi CRUD todos
const TodoManager = (function() {
    // Array untuk menyimpan todos
    let todos = [];
    
    // Filter aktif saat ini
    let currentFilter = 'all';
    
    // ID untuk todo yang sedang diedit
    let editingId = null;
    
    /**
     * Membuat todo baru
     * @param {string} text - Teks todo
     * @returns {Object} Todo object
     */
    function createTodo(text) {
        return {
            id: Date.now().toString(), // Gunakan timestamp sebagai ID unik
            text: text.trim(),
            completed: false,
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }
    
    /**
     * Menambahkan todo baru
     * @param {string} text - Teks todo
     */
    function addTodo(text) {
        if (!text || !text.trim()) return false;
        
        const newTodo = createTodo(text);
        todos.push(newTodo);
        
        // Simpan ke storage
        Storage.saveTodos(todos);
        
        // Render ulang UI
        renderTodos();
        
        return true;
    }
    
    /**
     * Mengedit todo
     * @param {string} id - ID todo
     * @param {string} newText - Teks baru
     */
    function editTodo(id, newText) {
        if (!newText || !newText.trim()) return false;
        
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex].text = newText.trim();
            Storage.saveTodos(todos);
            renderTodos();
            return true;
        }
        
        return false;
    }
    
    /**
     * Menghapus todo
     * @param {string} id - ID todo
     */
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        Storage.saveTodos(todos);
        renderTodos();
    }
    
    /**
     * Menandai todo sebagai selesai/belum
     * @param {string} id - ID todo
     * @param {boolean} completed - Status completed
     */
    function toggleTodo(id, completed) {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex].completed = completed;
            Storage.saveTodos(todos);
            renderTodos();
        }
    }
    
    /**
     * Membersihkan semua todo yang sudah selesai
     */
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        Storage.saveTodos(todos);
        renderTodos();
    }
    
    /**
     * Memfilter todos berdasarkan filter aktif
     * @returns {Array} Array todos yang sudah difilter
     */
    function getFilteredTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }
    
    /**
     * Mengatur filter aktif
     * @param {string} filter - Filter ('all', 'active', 'completed')
     */
    function setFilter(filter) {
        currentFilter = filter;
        renderTodos();
        
        // Update active class pada filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    /**
     * Memuat todos dari storage
     */
    function loadTodos() {
        todos = Storage.getTodos();
        renderTodos();
    }
    
    /**
     * Mengatur ulang urutan todos setelah drag & drop
     * @param {number} oldIndex - Index asal
     * @param {number} newIndex - Index tujuan
     */
    function reorderTodos(oldIndex, newIndex) {
        const filteredTodos = getFilteredTodos();
        
        // Cari todo yang dipindah di filtered array
        const movedTodo = filteredTodos[oldIndex];
        
        // Cari index todo tersebut di array utama
        const mainIndex = todos.findIndex(todo => todo.id === movedTodo.id);
        
        // Hapus dari posisi lama
        todos.splice(mainIndex, 1);
        
        // Hitung posisi baru di array utama
        let newMainIndex;
        if (newIndex === 0) {
            newMainIndex = 0;
        } else if (newIndex >= filteredTodos.length) {
            newMainIndex = todos.length;
        } else {
            const nextTodo = filteredTodos[newIndex];
            newMainIndex = todos.findIndex(todo => todo.id === nextTodo.id);
        }
        
        // Sisipkan di posisi baru
        todos.splice(newMainIndex, 0, movedTodo);
        
        // Simpan ke storage
        Storage.saveTodos(todos);
        
        // Render ulang
        renderTodos();
    }
    
    /**
     * Menghitung jumlah todo yang belum selesai
     * @returns {number} Jumlah todo aktif
     */
    function getActiveCount() {
        return todos.filter(todo => !todo.completed).length;
    }
    
    /**
     * Membuat elemen todo
     * @param {Object} todo - Todo object
     * @returns {HTMLElement} Elemen li untuk todo
     */
    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);
        li.setAttribute('draggable', 'true');
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <span class="todo-date">${todo.date}</span>
            <button class="todo-delete" title="Hapus tugas">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleTodo(todo.id, checkbox.checked);
        });
        
        const deleteBtn = li.querySelector('.todo-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });
        
        // Double click untuk edit
        li.addEventListener('dblclick', () => {
            showEditDialog(todo.id, todo.text);
        });
        
        // Drag & drop events
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        
        return li;
    }
    
    /**
     * Escape HTML untuk mencegah XSS
     * @param {string} text - Teks yang akan di-escape
     * @returns {string} Teks yang sudah di-escape
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Menampilkan dialog edit
     * @param {string} id - ID todo
     * @param {string} currentText - Teks saat ini
     */
    function showEditDialog(id, currentText) {
        editingId = id;
        const dialog = document.getElementById('editDialog');
        const editInput = document.getElementById('editInput');
        
        editInput.value = currentText;
        dialog.classList.add('show');
        editInput.focus();
        editInput.select();
    }
    
    /**
     * Menyembunyikan dialog edit
     */
    function hideEditDialog() {
        const dialog = document.getElementById('editDialog');
        dialog.classList.remove('show');
        editingId = null;
    }
    
    /**
     * Handle save edit
     */
    function handleSaveEdit() {
        const editInput = document.getElementById('editInput');
        const newText = editInput.value.trim();
        
        if (editingId && newText) {
            editTodo(editingId, newText);
            hideEditDialog();
        }
    }
    
    // Drag & Drop Handlers
    let dragSource = null;
    
    function handleDragStart(e) {
        dragSource = this;
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        document.querySelectorAll('.todo-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const items = document.querySelectorAll('.todo-item');
        items.forEach(item => item.classList.remove('drag-over'));
        
        if (this !== dragSource) {
            this.classList.add('drag-over');
        }
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.classList.remove('drag-over');
        
        if (dragSource === this) return;
        
        const draggedId = e.dataTransfer.getData('text/plain');
        const targetId = this.dataset.id;
        
        // Dapatkan filtered todos
        const filteredTodos = getFilteredTodos();
        
        // Cari index
        const oldIndex = filteredTodos.findIndex(todo => todo.id === draggedId);
        const newIndex = filteredTodos.findIndex(todo => todo.id === targetId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
            reorderTodos(oldIndex, newIndex);
        }
    }
    
    /**
     * Merender todos ke UI
     */
    function renderTodos() {
        const todoList = document.getElementById('todoList');
        const todoCount = document.getElementById('todoCount');
        
        if (!todoList) return;
        
        const filteredTodos = getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Tidak ada tugas</p>
                </li>
            `;
        } else {
            todoList.innerHTML = '';
            filteredTodos.forEach(todo => {
                todoList.appendChild(createTodoElement(todo));
            });
        }
        
        // Update counter
        if (todoCount) {
            const activeCount = getActiveCount();
            todoCount.textContent = `${activeCount} tugas tersisa`;
        }
    }
    
    // Public API
    return {
        loadTodos,
        addTodo,
        editTodo,
        deleteTodo,
        toggleTodo,
        clearCompleted,
        setFilter,
        showEditDialog,
        hideEditDialog,
        handleSaveEdit
    };
})();