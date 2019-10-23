document.addEventListener('DOMContentLoaded', () => {
    const name = prompt('Введите ваше имя: ', '');
    const socket = io('ws://cryptic-hollows-25494.herokuapp.com');
    socket.emit('reConnect', name);
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (message.value.trim()) {
            socket.emit('message', { name: name.trim() || 'Гость' , message: message.value });
        }
        message.value = '';
    });
    message.addEventListener('input', () => {
        socket.emit('change', name.trim() || 'Гость');
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
        li.classList.add('collection-item');
        const user = document.createElement('span');
        user.style.cssText = "font-weight: bold; text-decoration: underline;";
        user.textContent = name
        li.appendChild(user);
        const msg = document.createElement('span');
        msg.innerHTML = `<b>:</b>   ${message.trim()}`;
        li.appendChild(msg);
        messages.append(li);
        messages.scroll(0, messages.scrollHeight);
    });
    socket.on('change', changers => {
        change.textContent = changers.reduce((reducer, item, idx, arr) => {
            if (idx == arr.length-1) {
                return reducer + item + (arr.idx > 1 ? ' печатают...' : ' печатает...')
            }
            return reducer + item + ', '
        }, '')
    });
});