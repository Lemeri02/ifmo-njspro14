const name = prompt('Как вас зовут?').trim() || 'Гость';
const socket = io('ws://cryptic-hollows-25494.herokuapp.com');

socket.emit('reconnect', name);

form.addEventListener('submit', event => {
  event.preventDefault();
  if (message.value.trim()) {
    socket.emit('message', {
      name: name,
      message: message.value
    });
  }
  message.value = '';
});

message.addEventListener('input', () => {
  socket.emit('change', name);
});

socket.on('updateUserList', userList => {
  users.innerHTML = '';
  userList.forEach(name => {
    const user = document.createElement('li');
    user.classList.add('collection-item');
    user.textContent = name;
    users.append(user);
  });
});

socket.on('message', ({name, message}) => {
  const li = document.createElement('li');
  const user = document.createElement('span');
  const msg = document.createElement('span');

  li.classList.add('collection-item');
  user.style.cssText = "font-weight: bold; text-decoration: underline;";
  user.textContent = name
  li.appendChild(user);
  msg.innerHTML = `<strong>:</strong> ${message.trim()}`;
  li.appendChild(msg);
  messages.append(li);
});

socket.on('change', changers => {
  change.textContent = changers.reduce((reducer, item, idx, arr) => {
    if (idx == arr.length - 1) {
      return reducer + item + (arr.idx > 1 ? ' печатают...' : ' печатает...');
    }

    return reducer + item + ', ';
  }, '');
});