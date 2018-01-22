import React, { Component } from 'react';

class Messages extends Component {
  constructor(props) {
	  super(props);
	  this.scrollDown = this.scrollDown.bind(this)
  }
  
  /*
	*	Scrolls down the view of the messages.
	*/
	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}
	
	componentDidUpdate(newProps){
		this.scrollDown();

	}

	componentDidMount(){
		this.scrollDown();
	}


  render () {
    const { messages, user, typingUsers } = this.props;
    return (
      <div className="thread-container" ref='container'>
        <div className="thread">
          {
            messages.map((mes) => {
              return (
                <div 
                  key={mes.id}
                  className={`message-container ${mes.sender === user.name && 'right'}`}
                >
                  <div className="time">{mes.time}</div>
                  <div className="data">
                    <div className="message">{mes.message}</div>
                    <div className="name">{mes.sender}</div>
                  </div>
                </div>
              ) 
            })
          }
            
          {
            typingUsers.map((name) => {
              return (
                <div className="typing-user" key={name}>
                  {`${name} is typing . . .`}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Messages;