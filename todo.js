  const STORAGE_KEY = 'todo.tasks.v1';
    const els = {
      input: document.getElementById('newTask'),
      addBtn: document.getElementById('addBtn'),
      list: document.getElementById('list'),
      stats: document.getElementById('stats'),
      empty: document.getElementById('emptyState'),
      clearCompleted: document.getElementById('clearCompleted'),
      markAll: document.getElementById('markAll'),
      filters: document.querySelectorAll('.chip'),
      exportBtn: document.getElementById('exportBtn'),
      badge: document.getElementById('badge'),
    };

    let state = {
      tasks: loadTasks(),
      filter: 'all',
      dragId: null,
    };

    function loadTasks(){
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const tasks = raw ? JSON.parse(raw) : [];
        return Array.isArray(tasks) ? tasks : [];
      } catch { return []; }
    }
    function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); }

    function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

    function addTask(text){
      const trimmed = text.trim();
      if(!trimmed) return;
      state.tasks.unshift({ id: uid(), text: trimmed, completed: false, createdAt: Date.now() });
      save();
      render();
    }

    function updateTask(id, patch){
      const idx = state.tasks.findIndex(t => t.id === id);
      if(idx === -1) return;
      state.tasks[idx] = { ...state.tasks[idx], ...patch };
      save();
      renderRow(id); // targeted re-render
      updateStats();
    }

    function deleteTask(id){
      state.tasks = state.tasks.filter(t => t.id !== id);
      save();
      render();
    }

    function clearCompleted(){
      state.tasks = state.tasks.filter(t => !t.completed);
      save();
      render();
    }

    function toggleAll(){
      const allDone = state.tasks.every(t => t.completed);
      state.tasks = state.tasks.map(t => ({...t, completed: !allDone}));
      save();
      render();
    }

    function setFilter(key){
      state.filter = key;
      document.querySelectorAll('.chip').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.filter === key));
      });
      render();
    }

    function formatDate(ts){
      const d = new Date(ts);
      return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'});
    }

    function visibleTasks(){
      if(state.filter === 'active') return state.tasks.filter(t => !t.completed);
      if(state.filter === 'completed') return state.tasks.filter(t => t.completed);
      return state.tasks;
    }

    function updateStats(){
      const total = state.tasks.length;
      const remaining = state.tasks.filter(t => !t.completed).length;
      els.stats.textContent = `${remaining} pending • ${total} total`;
      els.empty.hidden = total !== 0;
      els.badge.textContent = remaining > 0 ? `${remaining} pending` : 'All caught up!';
    }

    function render(){
      els.list.innerHTML = '';
      for(const t of visibleTasks()){
        els.list.appendChild(renderItem(t));
      }
      updateStats();
    }

    function renderRow(id){
      const li = els.list.querySelector(`[data-id="${id}"]`);
      if(!li){ render(); return; }
      const t = state.tasks.find(x => x.id === id);
      const fresh = renderItem(t);
      li.replaceWith(fresh);
    }

    function renderItem(task){
      const tpl = document.getElementById('itemTemplate');
      const li = tpl.content.firstElementChild.cloneNode(true);
      li.dataset.id = task.id;
      li.classList.toggle('completed', task.completed);

      const checkbox = li.querySelector('input[type="checkbox"]');
      const label = li.querySelector('.task-label');
      const meta = li.querySelector('.meta');
      const editBtn = li.querySelector('.edit');
      const saveBtn = li.querySelector('.save');
      const delBtn = li.querySelector('.delete');

      checkbox.checked = task.completed;
      label.textContent = task.text;
      meta.textContent = `added ${formatDate(task.createdAt)}`;

      checkbox.addEventListener('change', () => updateTask(task.id, { completed: checkbox.checked }));

      function enterEdit(){
        label.setAttribute('contenteditable','true');
        label.focus();
        placeCaretAtEnd(label);
        editBtn.hidden = true; saveBtn.hidden = false;
      }
      function exitEdit(saveChanges){
        label.removeAttribute('contenteditable');
        editBtn.hidden = false; saveBtn.hidden = true;
        if(saveChanges){
          const newText = label.textContent.trim();
          if(newText) updateTask(task.id, { text: newText });
          else deleteTask(task.id);
        } else {
          label.textContent = task.text; // revert
        }
      }

      editBtn.addEventListener('click', enterEdit);
      saveBtn.addEventListener('click', () => exitEdit(true));
      delBtn.addEventListener('click', () => deleteTask(task.id));

      label.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){ e.preventDefault(); exitEdit(true); }
        if(e.key === 'Escape'){ e.preventDefault(); exitEdit(false); }
      });
      label.addEventListener('blur', () => {
        if(label.getAttribute('contenteditable') === 'true') exitEdit(true);
      });

      // Drag & drop ordering
      li.addEventListener('dragstart', () => { state.dragId = task.id; li.style.opacity = .5; });
      li.addEventListener('dragend', () => { state.dragId = null; li.style.opacity = 1; });
      li.addEventListener('dragover', (e) => { e.preventDefault(); li.style.outline = '1px dashed var(--accent)'; });
      li.addEventListener('dragleave', () => { li.style.outline = 'none'; });
      li.addEventListener('drop', (e) => {
        e.preventDefault(); li.style.outline = 'none';
        const from = state.tasks.findIndex(t => t.id === state.dragId);
        const to = state.tasks.findIndex(t => t.id === task.id);
        if(from === -1 || to === -1 || from === to) return;
        const [moved] = state.tasks.splice(from, 1);
        state.tasks.splice(to, 0, moved);
        save();
        render();
      });

      return li;
    }

    function placeCaretAtEnd(el){
      const range = document.createRange();
      range.selectNodeContents(el); range.collapse(false);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    }

    // --- Event wiring ---
    els.addBtn.addEventListener('click', () => addTask(els.input.value));
    els.input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') addTask(els.input.value);
    });
    function clearInput(){ els.input.value = ''; }
    els.list.addEventListener('click', (e) => {
      if(e.target === els.addBtn) clearInput();
    });
    // Clear input after adding successfully
    const addAndClear = () => { const v = els.input.value; addTask(v); clearInput(); };
    els.addBtn.onclick = addAndClear;
    els.input.onkeydown = (e)=>{ if(e.key==='Enter'){ e.preventDefault(); addAndClear(); }};

    els.clearCompleted.addEventListener('click', clearCompleted);
    els.markAll.addEventListener('click', toggleAll);
    els.filters.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

    els.exportBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'tasks.json'; a.click();
      URL.revokeObjectURL(url);
    });

    // First render
    render();