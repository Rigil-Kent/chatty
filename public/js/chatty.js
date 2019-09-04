const socket = io();

// Elements
const $messageForm = document.querySelector('#msg-form')
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locFormButton = document.querySelector('#location-share');
const $messages = document.querySelector('#messages');


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const serverMessageTemplate = document.querySelector('#server-message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


// Options
const {nickname, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const autoscroll = () => {
    // Grab the render message element
    const $newMessage = $messages.lastElementChild;

    // Get height of newMessage
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Messages container height
    const containerHeight = $messages.scrollHeight;

    // Scroll distance
    const scrollOffset = $messages.scrollTop +visibleHeight;
    
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}
// Events
socket.on('messageUpdated', (message) => {
    
    const html = Mustache.render(serverMessageTemplate, {
        message: message.text
    })

    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});


socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        nickname: message.nickname,
        message: message.text,
        createdAt: moment(message.createdAt).format('LLL')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});



socket.on('locMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        nickname: message.nickname,
        message: message,
        createdAt: moment(message.createdAt).format('LLL')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});


socket.on('roomUpdated', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.querySelector('#userlist').innerHTML = html;
})

// Event Listeners
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');
    

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (msg) => {
        $messageFormButton.removeAttribute('disabled', 'disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        console.log(msg);
    });
})


$locFormButton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Bummer! Geolocation isn\' supported by your browser');
    }

    $locFormButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log("Location shared");
            $locFormButton.removeAttribute('disabled', 'disabled');
        });
    });

});


socket.emit('join', {nickname, room}, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});