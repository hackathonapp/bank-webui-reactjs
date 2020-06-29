import React, {Component} from 'react';

class AccountCreated extends Component {
  componentDidMount = () => {};
  render() {
    return (
      <div className="wrapper">
        <div className="inner">
          <div className="flash-demo">
            For the purpose of demonstration, the temporary password is being
            shown here - [<label>{this.props.tempPassword}</label>]
          </div>
          <div className="success" style={{minHeight: '500px'}}>
            <div className="otp-image">
              <img src="images/myimage-4.png" alt="" className="image-4" />
              <h1 className="success">SUCCESS</h1>
              <h2>Your account has been created.</h2>
              <p>
                A confimation email was also sent to your email address with
                <br />
                your username and temporary password.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AccountCreated;
