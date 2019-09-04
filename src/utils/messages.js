const generateMessage = (nickname, text) => {
    return {
        nickname, 
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocMessage = (nickname, text) => {
    return {
        nickname,
        text,
        createdAt: new Date().getTime()
    }
}
const generateWelcome = (text, motd) => {
    return {
        text,
        motd,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocMessage,
    generateWelcome    
}