const users = []


const getUser = (id) => {
    return users.find((user) => user.id === id);
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
}


const addUser = ({id, nickname, room}) => {
    // Clean user data
    nickname = nickname.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    // Validate data exists
    if (!nickname || !room) {
        return {
            error: 'Nickname and Room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.nickname === nickname
    });

    // Validate nickname
    if (existingUser) {
        return {
            error: 'nickname is in use. Choose another name or join another room'
        }
    }

    // Store user
    const user = { id, nickname, room }
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}