const API_URL = 'http://localhost:8000/tasks';

// Fetch and display tasks
async function fetchTasks() {
    const response = await fetch(`${API_URL}/`);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.innerHTML = `
            <h3>${task.title}</h3>
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