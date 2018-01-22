import React, { Component } from 'react';
import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT } from '../Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';

const socketUrl = 'localhost:3231';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  /**
   * Connect to and initializes the socket
   */
  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log("Connected!");
    });
    this.setState({socket: socket});
  }

  /**
   * Set the user property in state
   * @param user {id:number, name:string}
   */
  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({user: user});
  }

  /**
   * Set the user property in state to null
  */
  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT)
    this.setState({user: null});
  }



  render() {
    // const { title } = this.props;
    const { socket, user } = this.state;
    return (
      <div className="container">
        {
          !user
          ? <LoginForm socket={socket} setUser={this.setUser}/>
          : <ChatContainer socket={socket} logout={this.logout} user={user}/>
        }
      </div>
    );
  }
}

export default Layout;
