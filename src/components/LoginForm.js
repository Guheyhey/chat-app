import React, { Component } from 'react';

import { VERIFY_USER } from '../Events';

class LoginForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      nickname: "",
      error: ""
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, this.setUser);
  }

  handleChange = (e) => {
    this.setState({nickname: e.target.value});
  }

  setUser = ({user, isUser}) => {
    // console.log(user, isUser);
    if (isUser) {
      this.setError("User name taken!");
    } else {
      this.props.setUser(user);
      this.setError("");
    }
  }

  setError = (error) => {
    this.setState({error: error});
  }

  render () {
    const {nickname, error} = this.state;
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} className="login-form">
          <label htmlFor="nickname">
            <h1>Got a nickname?</h1>
          </label>
          <input 
            type="text"
            ref={(input) => {this.textInput = input}}
            id="nickname"
            value={nickname}
            onChange={this.handleChange}
            placeholder="My Cool Username"
            />
            <div className="error">{error ? error : ""}</div>
        </form>        
      </div>
    );
  }
}

export default LoginForm;