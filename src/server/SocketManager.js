const io = require('./index.js').io;

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
  LOGOUT, COMMUNITY_CHAT, MESSAGE_SENT, TYPING, MESSAGE_RECIEVED } = require('../Events');
const { createUser, createMessage, createChat } = require('../Factories');

let connectedUsers = {};
let communityChat = createChat();
let chats = [communityChat];


module.exports = function(socket) {
  console.log("Socket ID: " + socket.id);

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

  // Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (checkIsUser(connectedUsers, nickname)) {
      callback({isUser: true, user: null});
    } else {
      callback(
        {
          isUser: false, 
          user: createUser( {name: nickname} )
        }
      );
    }
  })

  // User Connects with username
  socket.on(USER_CONNECTED, function(user) {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name);
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  })


  // User disconnect
  socket.on('disconnect', function (){
    if(!!socket.user){
      connectedUsers = removeUser(connectedUsers, socket.user.name)
      
      io.emit(USER_DISCONNECTED, connectedUsers)
      console.log("disconnected", connectedUsers)
    }
    
  })

  // User logout
  socket.on(LOGOUT, function(){
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit(USER_DISCONNECTED, connectedUsers)
    console.log("logout", connectedUsers)
  })

  //send community chat 
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  })

  

  //user sends message 
  socket.on(MESSAGE_SENT, function({chatId, message}){
    sendMessageToChatFromUser(chatId, message)
  })

	//add user to typing users on chatId 
  socket.on(TYPING, function({chatId, isTyping}){
   
    sendTypingFromUser(chatId, isTyping)
  })
}

/**
 * Return a function that will take a chat id and message
 * and then emit a broadcas to the chat id
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
  }
}

/**
 * Returns a function that will take a chat id and boolean isTyping variable
 * and then emit a broadcast to the chat id that the sender is typing
 * @param sender {string} username of sender
 * @return function(chatId, isTyping)
 */
function sendTypingToChat(user){
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping})
  }
}

/**
 * Adds user to list passed in.
 * @param userList {Object} Object with key value pairs of users
 * @param user {User} the user to added to the list.
 * @return userList {Object} Object with key value pairs of Users
 */
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

/**
 * Removes user from the list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {string} name of user to be removed
 * @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList, username){
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

/**
 * Checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function checkIsUser(userList, username) {
  return username in userList;
}
