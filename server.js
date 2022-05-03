const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);

    socket.on('addTask', (taskData) => {
        tasks.push(taskData);
        socket.broadcast.emit('addTask', taskData);
    });

    socket.on('removeTask', (taskId) => {
        const taskIdIndex = tasks.findIndex(task => task.id === taskId);
        tasks.splice(taskIdIndex, 1);
        socket.broadcast.emit('removeTask', taskId);
    });
    
    socket.on('updateTask', (task) => {
      tasks.push(task);
      socket.broadcast.emit('updateTask', task);
    });
});