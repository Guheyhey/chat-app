const uuidv4 = require('uuid/v4');

/**
 * createUSer
 * Creates a user
 * @prop id {string}
 * @prop name {string}
 * @param {object} 
 *   name {string}
 */
const createUser = ({name} = {}) => {
  return {
    id: uuidv4(),
    name: name
  }
}


/**
 * createMessage
 * Creates a messages object.
 * @prop id {string}
 * @prop time {Date} the time in 24hr format i.e. 14:22
 * @prop message {string} actual string message
 * @prop sender {string} sender of the message
 * @param {object} 
 *	 message {string}
 *   sender {string}
 */
const createMessage = ({message, sender} = {}) => {
  return {
    id: uuidv4(),
    time: getTime(new Data(Date.now())),
    message,
    sender
  }
}


/**
 * createChat
 * Creates a Chat object
 * @prop id {string}
 * @prop name {string}
 * @prop messages {Array.Message}
 * @prop users {Array.string}
 * @prop addMessage {function} adds message to chat.
 * @prop addTypingUser {function} adds a username to typing users of chat.
 * @prop removeTypingUser {function} removes a username to typing users of chat.
 * @param {object} 
 *   messages {Array.Message}
 *   name {string}
 *   users {Array.string}
 */
const createChat = ({messages = [], name = "Community", users = []} = {}) => {
  return {
    id: uuidv4(),
    name,
    messages,
    users,
    typingUsers: []
  }
}

// // ES5 version of above code
// var createChat = function createChat() {
//   var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
//       _ref3$messages = _ref3.messages,
//       messages = _ref3$messages === undefined ? [] : _ref3$messages,
//       _ref3$name = _ref3.name,
//       name = _ref3$name === undefined ? "Community" : _ref3$name,
//       _ref3$users = _ref3.users,
//       users = _ref3$users === undefined ? [] : _ref3$users;

//   return {
//     id: uuidv4(),
//     name: name,
//     messages: messages,
//     users: users,
//     typingUsers: []
//   };
// }



/**
 * getTime
 * @param date {Date}
 * @return a string represented in 24hr time i.e. '11:30:30'
 */
const getTime = (date) => {
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`
}


module.exports = {
	createChat,
	createMessage,
	createUser
}