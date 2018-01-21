import React, { Component } from 'react';
import io from 'socket.io-client';

const socketUrl = 'http://192.168.1.13:3231';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null
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

  /**
   * Set the user property in state to null
  */

 

  render() {
    const { title } = this.props;
    return (
      <div className="container">
        {title}
      </div>
    );
  }
}

export default Layout;