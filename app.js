
const [{ Server: h1 }, x] = [require('http'), require('express')];
const socketIO = require('socket.io'); // сокеты

const Router = x.Router();
const PORT = 2222;
const { log } = console;
const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const app = x();
Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));
app
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(x.static('.'))
  .use('/', Router)
  .use(({ res: r }) => r.status(404).end('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).end(`Ошибка: ${e}`))
  /* .set('view engine', 'pug') */
  .set('x-powered-by', false);
const s = h1(app)
.listen(process.env.PORT || PORT, () => log(process.pid));

const ws = socketIO(s);
const cb = d => log(d);
ws.on('connection', wsock => {
  log('Новый пользователь!');
  wsock.emit('serv', 'Добро пожаловать!', cb);
  wsock.on('msg', msg => wsock.emit('serv', `Вы сказали: ${msg}`, cb));		
  wsock.on('disconnect', () => log('Пользователь отвалился!'));
});
