import React, { Component } from 'react';

class MessageInput extends Component {

  constructor(props) {
	  super(props);
	
    this.state = { 
      message:"", 
      isTyping:false
    };
	  this.handleSubmit = this.handleSubmit.bind(this)
	  this.sendMessage = this.sendMessage.bind(this) 
	}

  /**
	 *	Handles submitting of form.
	 *	@param e {Event} onsubmit event
	 */
  handleSubmit(e) {
		e.preventDefault()
		this.sendMessage()
		this.setState({message:""})
	}
	
	/**
	 *	Send message to add to chat.
	 */
	sendMessage() {
		this.props.sendMessage(this.state.message)
		// this.blur()
  }
  
  /**
	 *	Starts/Stops the interval for checking 
	 */
	sendTyping() {
		this.lastUpdateTime = Date.now()
		if (!this.state.isTyping) {
			this.setState({isTyping:true})
			this.props.sendTyping(true);
			this.startCheckingTyping()
		}
  }
  
  /*
	*	Start an interval that check if the user is typing
	*/
	startCheckingTyping(){
    // console.log("typing")
		this.typingInterval = setInterval(() => {
				if ((Date.now() - this.lastUpdateTime) > 300) {
					this.setState({isTyping:false})
					this.stopCheckingTyping()
				}
			}, 300)
  }
  
  /*
	*	Stops the interval from checking if the user is typing
	*/
	stopCheckingTyping(){
    // console.log("stop typing")
		if (this.typingInterval) {
			clearInterval(this.typingInterval)
			this.props.sendTyping(false)
		}
  }
  
  componentWillUnmount() {
    // clear the checkTyping listener
		this.stopCheckingTyping();
	}
  
  render () {
    const { message } = this.state
		return (
			<div className="message-input">
        <form  
          onSubmit={this.handleSubmit}
          className="message-form">
          
          <input 
            id="message"
            ref={"messageinput"}
            type="text" 
            className="form-control"
            value = { message } 
            autoComplete={'off'}
            placeholder="Type something to send"
            onKeyUp={(e)=>{ e.keyCode !== 13 && this.sendTyping() }}
            onChange = {
              (event)=>{
                this.setState({message: event.target.value})
              }
          }/>
          <button 
            disabled={ message.length < 1} 
            type="submit" 
            className="send">
            Send
          </button>
        </form>
			</div>
				
		);
  }
}

export default MessageInput;