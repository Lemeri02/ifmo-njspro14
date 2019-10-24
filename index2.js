const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const Router = express.Router();
const PORT = 4000;
 
Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));
app
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(express.static('.'))
  .use('/', Router)
  .use(({ res: r }) => r.status(404).end('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).end(`Ошибка: ${e}`))
  //.use(express.static('public'))
  .listen(process.env.PORT || PORT, () => console.log(process.pid));

console.log('http://localhost:4000');



const users = [];
const changers = new Set();
io.on('connection', socket => {
    socket.on('reconnect', name => {
        const {id} = socket;
        name = name.trim() || 'Гость';
        users.push({name, id});
        socket.broadcast.emit('updateUserList', users.map(({name}) => name));
        socket.emit('updateUserList', users.map(({name}) => name));
    });
    socket.on('disconnect', () => {
        const idx = users.findIndex(item => item.id == socket.id);
        (idx !== -1) ? users.splice(idx, 1) : false;
        socket.broadcast.emit('updateUserList', users.map(({name}) => name));
        socket.emit('updateUserList', users.map(({name}) => name));
    });
    socket.on('message', ({name, message}) => {
        socket.broadcast.emit('message', {name, message});
        socket.emit('message', {name, message});

    });
    socket.on('change', name => {
        let timers;
        if (changers.has(name)) {
            clearInterval(timers);
            timers = setTimeout(()=>{
                changers.delete(name);
                socket.broadcast.emit('change', Array.from(changers));
            }, 1500);
        } else {
            changers.add(name);
            timers = setTimeout(()=>{
                changers.delete(name);
                socket.broadcast.emit('change', Array.from(changers));
            }, 1500);
        }
        socket.broadcast.emit('change', Array.from(changers));
    })
})