(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const form = $("#todo-form");
  const input = $("#todo-input");
  const list = $("#todo-list");
  const leftCount = $("#left-count");
  const filters = $$(".filters .chip");
  const clearCompletedBtn = $("#clear-completed");

  const STORAGE_KEY = "todolist:v1";
  let state = {
    items: loadItems(),
    filter: "all", // all | active | completed
  };

  function loadItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }

  function addItem(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    state.items.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: trimmed,
      completed: false,
    });
    saveItems();
    render();
  }

  function removeItem(id) {
    state.items = state.items.filter(it => it.id !== id);
    saveItems();
    render();
  }

  function toggleItem(id) {
    state.items = state.items.map(it => it.id === id ? { ...it, completed: !it.completed } : it);
    saveItems();
    render();
  }

  function clearCompleted() {
    state.items = state.items.filter(it => !it.completed);
    saveItems();
    render();
  }

  function setFilter(filter) {
    state.filter = filter;
    render();
  }

  function filteredItems() {
    switch (state.filter) {
      case "active": return state.items.filter(it => !it.completed);
      case "completed": return state.items.filter(it => it.completed);
      default: return state.items;
    }
  }

  function updateLeftCount() {
    const count = state.items.filter(it => !it.completed).length;
    leftCount.textContent = `${count}개 남음`;
  }

  function render() {
    list.innerHTML = "";
    for (const it of filteredItems()) {
      const li = document.createElement("li");
      li.className = "item";
      li.dataset.id = it.id;

      li.innerHTML = `
        <input type="checkbox" class="checkbox" ${it.completed ? "checked" : ""} aria-label="완료 표시">
        <span class="text ${it.completed ? "completed" : ""}">${escapeHTML(it.text)}</span>
        <button class="icon-btn" aria-label="삭제">✕</button>
      `;

      list.appendChild(li);
    }

    // 필터 chip 활성화
    for (const chip of filters) {
      chip.classList.toggle("chip--active", chip.dataset.filter === state.filter);
    }

    updateLeftCount();
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, s => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[s]));
  }

  // 이벤트 바인딩
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItem(input.value);
    input.value = "";
    input.focus();
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest(".item");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.classList.contains("checkbox")) {
      toggleItem(id);
    } else if (e.target.classList.contains("icon-btn")) {
      removeItem(id);
    }
  });

  filters.forEach(chip => {
    chip.addEventListener("click", () => setFilter(chip.dataset.filter));
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  // 최초 그리기
  render();
})();
