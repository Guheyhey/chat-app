import React, { Component } from 'react';

import * as Events from '../../Events';
import SideBar from './SideBar';
import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      activeChat: null
    };
  }

  componentDidMount() {
    const {socket} = this.props;
    socket.emit(Events.COMMUNITY_CHAT, this.resetChat);
  }

  setActiveChat = (activeChat) => {
    this.setState({activeChat: activeChat});
  }

  /**
	*	Reset the chat back to only the chat passed in.
	* @param chat {Chat}
	*/
	resetChat(chat){
		return this.addChat(chat, true)
	}

	/**
	 *	Adds chat to the chat container, if reset is true removes all chats
	 *	and sets that chat to the main chat.
	 *	Sets the message and typing socket events for the chat.
	 *	
	 *	@param chat {Chat} the chat to be added.
	 *	@param reset {boolean} if true will set the chat as the only chat.
	 */
	addChat(chat, reset){
		const { socket } = this.props
		const { chats } = this.state
		const newChats = reset ? [chat] : [...chats, chat]
		
		this.setState({chats: newChats, activeChat: chat})
		
		const messageEvent = `${Events.MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${Events.TYPING}-${chat.id}`

		socket.on(messageEvent, this.addMessageToChat(chat.id))
		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		
		//this.socketEvents.push(messageEvent, typingEvent) // used to remove event listerners
	}

	/**
   * Returns a function that will
   * adds message to chat with the chatId passed in
	 * @param chatId {number}
	 */
	addMessageToChat(chatId){
		return message =>{
			const { chats } = this.state
			let newChats = chats.map((chat) => {
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat;
			})
			this.setState({chats:newChats})
		}
	}

	/**
	*	Updates the typing of chat with id passed in.
	*	@param chatId {number}
	*/
	updateTypingInChat(chatId){
		return ({isTyping, user}) =>{
      if(user !== this.props.user.name){

        const { chats } = this.state
        let newChats = chats.map((chat) => {
          if(chat.id === chatId){
            if(isTyping && !chat.typingUsers.includes(user))
              chat.typingUsers.push(user)
            else if(!isTyping && chat.typingUsers.includes(user))
              chat.typingUsers = chat.typingUsers.filter(u => u !== user)
          }
          return chat;
        })
        this.setState({chats:newChats})
      }
    }
	}

  /**
   * Adds a message to the specified chat
   * @param chatId {number}  The id of the chat to be added to.
   * @param message {string} The message to be added to the chat.
   */
  sendMessage = (chatId, message) => {
    const {socket} = this.props;
    socket.emit(Events.MESSAGE_SENT, {chatId, message})
  }


  /**
   * Sends typing status to server.
   * @param chatId {number} the id of the chat being typed in.
   * @param typing {boolean} If the user is typing still or not.
   */
  sendTyping = (chatId, isTyping) => {
    const {socket} = this.props;
    socket.emit(Events.TYPING, {chatId, isTyping});
  }



  render () {
    const { user, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />

        <div className="chat-room-container">
          {
            activeChat !== null
            ? (
              <div className="chat-room">
                <ChatHeading name={activeChat.name}/>

                <Messages
                  messages={activeChat.messages}
                  user={user}
                  typingUsers={activeChat.typingUsers}
                />

                <MessageInput
                  sendMessage={
                    (message) => {
                      this.sendMessage(activeChat.id, message)
                    }
                  }
                  sendTyping={
                    (isTyping) => {
                      this.sendTyping(activeChat.id, isTyping)
                    }
                  }
                />
              </div>
            )
            : (
              <div className="chat-room choose">
                <h3>Choose a chat!</h3>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default ChatContainer;
