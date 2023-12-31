import React, { Component, forwardRef, useImperativeHandle, useRef } from 'react';
import Existinguser from '../ExistingUser/ExistingUser'
import Newuser from '../NewUser/NewUser'
import "./Login.css"

class login extends Component {
  constructor(props) {
    super(props);
      this.showLogin= true
      this.showNewProfile= false
      this.increment=0
      this.buttonText= "Create New Profile"
      this.switchProfile = this.switchProfile.bind(this);
   }

   switchProfile = () => {
        this.showLogin = !this.showLogin;
        this.showNewProfile = !this.showNewProfile;
        this.increment = this.increment+1
          if (this.increment %2 == 0){
            this.buttonText = "Create New Profile"
          }
          else {
            this.buttonText = "Login"
          }
      this.forceUpdate();
  }

  render() {
    return (
      <div>
        {this.showLogin && <Existinguser />}
        {this.showNewProfile && <Newuser switchProfile={this.switchProfile} />}
        <div style={{backgroundColor:"#A8C3BC", height: "40vh"}}>
          <div style={{width: "fit-content", margin:"auto", paddingTop:"100px"}}>
          <button onClick={this.switchProfile}>{this.buttonText}</button>
          </div>
        </div>
      </div>
    );
  }
}
 
export default login;
