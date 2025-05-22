const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// In-memory storage
let tasks = [];
let teamMembers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Designer'
    }
];

// Helper functions
const findTaskById = (id) => tasks.find(task => task.id === id);
const findTeamMemberById = (id) => teamMembers.find(member => member.id === id);

// Task routes
app.get('/api/tasks', (req, res) => {
    const { status, assignee, priority } = req.query;
    let filteredTasks = [...tasks];

    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (assignee) {
        filteredTasks = filteredTasks.filter(task => task.assigneeId === assignee);
    }
    if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    res.json(filteredTasks);
});

app.get('/api/tasks/:id', (req, res) => {
    const task = findTaskById(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

app.post('/api/tasks', (req, res) => {
    const { title, description, assigneeId, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    if (assigneeId && !findTeamMemberById(assigneeId)) {
        return res.status(400).json({ error: 'Invalid assignee ID' });
    }

    const newTask = {
        id: uuidv4(),
        title: title.trim(),
        description: description?.trim() || '',
        assigneeId: assigneeId || null,
        priority: priority || 'medium',
        status: 'todo',
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const task = findTaskById(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, assigneeId, priority, status, dueDate } = req.body;

    if (title !== undefined) {
        if (!title.trim()) {
            return res.status(400).json({ error: 'Task title cannot be empty' });
        }
        task.title = title.trim();
    }

    if (description !== undefined) {
        task.description = description.trim();
    }

    if (assigneeId !== undefined) {
        if (assigneeId && !findTeamMemberById(assigneeId)) {
            return res.status(400).json({ error: 'Invalid assignee ID' });
        }
        task.assigneeId = assigneeId;
    }

    if (priority !== undefined) {
        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority level' });
        }
        task.priority = priority;
    }

    if (status !== undefined) {
        if (!['todo', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        task.status = status;
    }

    if (dueDate !== undefined) {
        task.dueDate = dueDate;
    }

    task.updatedAt = new Date().toISOString();
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Team member routes
app.get('/api/team-members', (req, res) => {
    res.json(teamMembers);
});

app.get('/api/team-members/:id', (req, res) => {
    const member = findTeamMemberById(req.params.id);
    if (!member) {
        return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(member);
});

app.post('/api/team-members', (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Check for duplicate email
    if (teamMembers.some(member => member.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    const newMember = {
        id: uuidv4(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role?.trim() || 'Team Member'
    };

    teamMembers.push(newMember);
    res.status(201).json(newMember);
});

app.put('/api/team-members/:id', (req, res) => {
    const member = findTeamMemberById(req.params.id);
    if (!member) {
        return res.status(404).json({ error: 'Team member not found' });
    }

    const { name, email, role } = req.body;

    if (name !== undefined) {
        if (!name.trim()) {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }
        member.name = name.trim();
    }

    if (email !== undefined) {
        if (!email.trim()) {
            return res.status(400).json({ error: 'Email cannot be empty' });
        }
        const emailLower = email.trim().toLowerCase();
        if (teamMembers.some(m => m.id !== member.id && m.email === emailLower)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        member.email = emailLower;
    }

    if (role !== undefined) {
        member.role = role.trim() || 'Team Member';
    }

    res.json(member);
});

app.delete('/api/team-members/:id', (req, res) => {
    const memberIndex = teamMembers.findIndex(member => member.id === req.params.id);
    if (memberIndex === -1) {
        return res.status(404).json({ error: 'Team member not found' });
    }

    // Remove assignments from tasks
    tasks.forEach(task => {
        if (task.assigneeId === req.params.id) {
            task.assigneeId = null;
        }
    });

    teamMembers.splice(memberIndex, 1);
    res.status(204).send();
});

// Dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
    const stats = {
        totalTasks: tasks.length,
        todoTasks: tasks.filter(task => task.status === 'todo').length,
        inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        highPriorityTasks: tasks.filter(task => task.priority === 'high').length,
        overdueTasks: tasks.filter(task => {
            if (!task.dueDate) return false;
            return new Date(task.dueDate) < new Date() && task.status !== 'completed';
        }).length
    };
    res.json(stats);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
