const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if(taskText !== '') {
        const li = document.createElement('li');
        li.textContent = taskText;

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        taskList.appendChild(li);
        taskInput.value = '';
    }
});
const express = require('express'); // Expressni chaqiramiz
const app = express();              // Express app yaratamiz
const port = 3000;                  // Server qaysi portda ishlaydi

app.use(express.static('.'));       // Hamma fayllarni (HTML, CSS, JS) brauzerga uzatish

app.listen(port, () => {            // Server ishga tushdi
    console.log(`Server ishga tushdi: http://localhost:${port}`);
});
const mongoose = require('mongoose');

// MongoDB Atlas URI (o‘zingning URI bilan almashtir)
const dbURI = 'mongodb+srv://username:password@cluster0.mongodb.net/todoApp?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB ga ulandi!'))
    .catch((err) => console.log('MongoDB ulanmadi:', err));
    const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
app.use(express.json()); // POST request uchun

// GET - barcha tasklarni olish
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST - yangi task qo‘shish
app.post('/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.json(newTask);
});

// PUT - taskni completed qilish
app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
    );
    res.json(updatedTask);
});

// DELETE - taskni o‘chirish
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task o‘chirildi' });
});
async function loadTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();

    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        if (task.completed) {
            li.style.textDecoration = 'line-through';
        }

        li.onclick = () => toggleTask(task._id, !task.completed);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(task._id);
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}
async function toggleTask(id, completed) {
    await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });

    loadTasks();
}
async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}
loadTasks ();
