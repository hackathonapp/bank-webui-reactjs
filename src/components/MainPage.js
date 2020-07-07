import React, {Component} from 'react';
import 'react-toastify/dist/ReactToastify.css';

class MainPage extends Component {
  render() {
    return (
      <div>
        <h1 className="cover-heading">Stay Safe, Bank Smart.</h1>
        <p className="lead">
          You don't have to go out to transfer funds, remit money, reload your
          pre-paid phones, pay bills, and more. Do all this from the safety of
          your home.
        </p>
        <p className="lead">
          <a href="onboard" className="btn btn-lg btn-secondary">
            Start here
          </a>
        </p>
        <p className="lead">&nbsp;</p>
        <p className="lead">
          Already have an account? <a href="login">Sign in</a>
        </p>
      </div>
    );
  }
}

export default MainPage;
