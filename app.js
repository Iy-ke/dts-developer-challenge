const API_URL = 'http://localhost:8000/tasks';

// Fetch all tasks and update UI
async function fetchTasks() {
    const response = await fetch(`${API_URL}/`);
    const tasks = await response.json();
    
    updateSummary(tasks);
    renderTasks(tasks);
}

// NEW: Update the summary dashboard counts
function updateSummary(tasks) {
    let todo = 0, inProgress = 0, done = 0;
    
    tasks.forEach(task => {
        if (task.status === 'To Do') todo++;
        if (task.status === 'In Progress') inProgress++;
        if (task.status === 'Done') done++;
    });

    document.getElementById('count-todo').innerText = todo;
    document.getElementById('count-progress').innerText = inProgress;
    document.getElementById('count-done').innerText = done;
}

// Render a list of tasks to the screen
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No tasks found.</p>';
        return;
    }

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-card';
        // Note: We now show the Task ID prominently at the top of the card
        div.innerHTML = `
            <h3>[ID: ${task.id}] ${task.title}</h3>
            <p>${task.description || 'No description provided.'}</p>
            <p><strong>Due:</strong> ${new Date(task.due_date).toLocaleString()}</p>
            <p><strong>Status:</strong> 
                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="To Do" ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
                    <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Done</option>
                </select>
            </p>
            <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(div);
    });
}

// NEW: Search for a specific task by ID
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('searchId').value;
    
    if (!id) return fetchTasks(); // If empty, show all tasks

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Task not found');
        }
        const task = await response.json();
        renderTasks([task]); // Render only the searched task in an array
    } catch (error) {
        alert(error.message);
        renderTasks([]); // Clear list if not found
    }
});

// Create a new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        due_date: document.getElementById('dueDate').value,
        status: document.getElementById('status').value
    };

    await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });
    
    e.target.reset();
    fetchTasks();
});

// Update Task Status
async function updateStatus(id, newStatus) {
    await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
}

// Delete Task
async function deleteTask(id) {
    if(confirm("Are you sure you want to delete this task?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}

// Initial load
fetchTasks();