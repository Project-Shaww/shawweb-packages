// todolist.js - Paquete para ShawOS SPM

(function() {
  'use strict';
  
  class TodoList {
    constructor(container, fileSystem, shawOS) {
      this.container = container;
      this.fs = fileSystem;
      this.shawOS = shawOS;
      this.todos = [];
      this.filename = 'todos.json';
      this.filter = 'all'; // all, active, completed
      
      // Esperar a que el container esté listo
      if (!this.container) {
        console.error('Container is null!');
        return;
      }
      
      this.render();
      this.loadTodos();
    }

    render() {
      this.container.innerHTML = `
        <style>
          .todo-app {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
          }
          
          .todo-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          
          .todo-header h2 {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .todo-stats {
            font-size: 14px;
            opacity: 0.95;
            margin-top: 4px;
          }
          
          .todo-input-section {
            padding: 20px;
            background: white;
            border-bottom: 2px solid #e9ecef;
          }
          
          .todo-input-container {
            display: flex;
            gap: 12px;
          }
          
          #todo-input {
            flex: 1;
            padding: 14px 18px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.2s;
            font-family: inherit;
          }
          
          #todo-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }
          
          #add-todo-btn {
            padding: 14px 28px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          #add-todo-btn:hover {
            background: #5568d3;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          
          #add-todo-btn:active {
            transform: translateY(0);
          }
          
          .todo-filters {
            padding: 16px 20px;
            background: white;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            gap: 8px;
            justify-content: center;
          }
          
          .filter-btn {
            padding: 8px 20px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            color: #495057;
          }
          
          .filter-btn:hover {
            border-color: #667eea;
            color: #667eea;
          }
          
          .filter-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
          }
          
          .todo-list {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }
          
          .todo-item {
            background: white;
            padding: 16px 20px;
            margin-bottom: 12px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            transition: all 0.2s;
            border: 2px solid transparent;
          }
          
          .todo-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: #667eea;
          }
          
          .todo-item.completed {
            opacity: 0.6;
            background: #f8f9fa;
          }
          
          .todo-checkbox {
            width: 22px;
            height: 22px;
            cursor: pointer;
            accent-color: #667eea;
          }
          
          .todo-text {
            flex: 1;
            font-size: 15px;
            color: #212529;
            word-break: break-word;
          }
          
          .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #6c757d;
          }
          
          .todo-time {
            font-size: 12px;
            color: #6c757d;
            margin-right: 8px;
          }
          
          .todo-delete {
            padding: 8px 14px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .todo-delete:hover {
            background: #c82333;
            transform: scale(1.05);
          }
          
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
          }
          
          .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          
          .empty-state-text {
            font-size: 18px;
            font-weight: 500;
          }
          
          .todo-actions {
            padding: 16px 20px;
            background: white;
            border-top: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .clear-completed-btn {
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .clear-completed-btn:hover {
            background: #5a6268;
          }
          
          .clear-completed-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        </style>
        
        <div class="todo-app">
          <div class="todo-header">
            <h2>✅ Lista de Tareas</h2>
            <div class="todo-stats">
              <span id="stats-total">0</span> tareas · 
              <span id="stats-active">0</span> activas · 
              <span id="stats-completed">0</span> completadas
            </div>
          </div>
          
          <div class="todo-input-section">
            <div class="todo-input-container">
              <input 
                type="text" 
                id="todo-input" 
                placeholder="¿Qué necesitas hacer hoy?"
                autocomplete="off"
              >
              <button id="add-todo-btn">
                <span>➕</span>
                <span>Añadir</span>
              </button>
            </div>
          </div>
          
          <div class="todo-filters">
            <button class="filter-btn active" data-filter="all">📋 Todas</button>
            <button class="filter-btn" data-filter="active">⏳ Activas</button>
            <button class="filter-btn" data-filter="completed">✅ Completadas</button>
          </div>
          
          <div class="todo-list" id="todo-list"></div>
          
          <div class="todo-actions">
            <div style="font-size: 14px; color: #6c757d;">
              <span id="items-left">0</span> tareas pendientes
            </div>
            <button class="clear-completed-btn" id="clear-completed">
              🗑️ Limpiar Completadas
            </button>
          </div>
        </div>
      `;
      
      this.attachEvents();
    }

    attachEvents() {
      const input = document.getElementById('todo-input');
      const addBtn = document.getElementById('add-todo-btn');
      const clearBtn = document.getElementById('clear-completed');
      const filterBtns = document.querySelectorAll('.filter-btn');
      
      // Añadir tarea
      const addTodo = () => {
        const text = input.value.trim();
        if (text) {
          this.addTodo(text);
          input.value = '';
          input.focus();
        }
      };
      
      addBtn.addEventListener('click', addTodo);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
      });
      
      // Limpiar completadas
      clearBtn.addEventListener('click', () => {
        this.clearCompleted();
      });
      
      // Filtros
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.filter = btn.dataset.filter;
          this.renderTodos();
        });
      });
    }

    loadTodos() {
      try {
        const data = this.fs.readFile(this.filename);
        if (data) {
          this.todos = JSON.parse(data);
          this.renderTodos();
        }
      } catch (error) {
        console.log('No hay tareas guardadas o error al cargar:', error);
        this.todos = [];
      }
    }

    saveTodos() {
      try {
        const data = JSON.stringify(this.todos, null, 2);
        if (this.fs.fileExists(this.filename)) {
          this.fs.writeFile(this.filename, data);
        } else {
          this.fs.createFile(this.filename, data);
        }
        
        // Actualizar desktop si existe
        if (this.shawOS && this.shawOS.updateDesktopIcons) {
          this.shawOS.updateDesktopIcons();
        }
      } catch (error) {
        console.error('Error al guardar tareas:', error);
      }
    }

    addTodo(text) {
      const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      this.todos.unshift(todo);
      this.saveTodos();
      this.renderTodos();
    }

    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveTodos();
        this.renderTodos();
      }
    }

    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
      this.saveTodos();
      this.renderTodos();
    }

    clearCompleted() {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveTodos();
      this.renderTodos();
    }

    getFilteredTodos() {
      switch (this.filter) {
        case 'active':
          return this.todos.filter(t => !t.completed);
        case 'completed':
          return this.todos.filter(t => t.completed);
        default:
          return this.todos;
      }
    }

    renderTodos() {
      const list = document.getElementById('todo-list');
      const filteredTodos = this.getFilteredTodos();
      
      // Actualizar estadísticas
      const total = this.todos.length;
      const completed = this.todos.filter(t => t.completed).length;
      const active = total - completed;
      
      document.getElementById('stats-total').textContent = total;
      document.getElementById('stats-active').textContent = active;
      document.getElementById('stats-completed').textContent = completed;
      document.getElementById('items-left').textContent = active;
      
      // Botón limpiar
      const clearBtn = document.getElementById('clear-completed');
      clearBtn.disabled = completed === 0;
      
      // Lista vacía
      if (filteredTodos.length === 0) {
        const emptyIcon = this.filter === 'completed' ? '🎉' : 
                         this.filter === 'active' ? '😌' : '📝';
        const emptyText = this.filter === 'completed' ? 'No hay tareas completadas' :
                         this.filter === 'active' ? 'No tienes tareas pendientes' :
                         '¡Comienza añadiendo tu primera tarea!';
        
        list.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${emptyIcon}</div>
            <div class="empty-state-text">${emptyText}</div>
          </div>
        `;
        return;
      }
      
      // Renderizar tareas
      list.innerHTML = filteredTodos.map(todo => {
        const date = new Date(todo.createdAt);
        const timeStr = date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return `
          <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
              type="checkbox" 
              class="todo-checkbox" 
              ${todo.completed ? 'checked' : ''}
              data-id="${todo.id}"
            >
            <div class="todo-text">${this.escapeHtml(todo.text)}</div>
            <div class="todo-time">${timeStr}</div>
            <button class="todo-delete" data-id="${todo.id}">🗑️</button>
          </div>
        `;
      }).join('');
      
      // Event listeners
      list.querySelectorAll('.todo-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          this.toggleTodo(parseInt(e.target.dataset.id));
        });
      });
      
      list.querySelectorAll('.todo-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.deleteTodo(parseInt(e.target.dataset.id));
        });
      });
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    static appSettings() {
      return {
        window: ['todolist', '✅ Lista de Tareas', '', 600, 700],
        needsSystem: false
      };
    }

    static appFileOpenerSettings() {
      return {
        window: ['todolist', '✅ Lista de Tareas', '', 600, 700],
        needsSystem: false
      };
    }
  }

  // Registrar el paquete globalmente
  if (!window.ShawOSPackages) {
    window.ShawOSPackages = {};
  }

  window.ShawOSPackages.todolist = TodoList;
  if (window.registerApp) {window.registerApp('todolist', TodoList, ['json'])}
  
  console.log('✅ Paquete TodoList instalado correctamente');
  console.log('📦 Usa: open-package todolist');
  console.log('🔍 Debug: TodoList.appSettings =', typeof TodoList.appSettings);

})();


