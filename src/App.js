import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Otp from './components/Otp';
import Kyc from './components/Kyc';
import AccountCreated from './components/AccountCreated';
import propState from './props';
import MainPage from './components/MainPage';

function OnboardSteps(props) {
  let overlay = {
    opacity: props.overlay.opacity,
    zIndex: props.overlay.zindex,
  };

  switch (props.step) {
    case 'onboarding':
      return (
        <div className="wrapper">
          <div className="inner">
            <img src="images/myimage-1.png" alt="" className="image-1" />
            <Onboarding
              bankApi={props.bankApi}
              onboarding={props.onboarding}
              errors={props.errors}
              regions={props.regions}
              provinces={props.provinces}
              cities={props.cities}
              datepicker={props.datepicker}
              changeState={props.changeState}
              overlay={props.overlay}
            />
            <img src="images/myimage-2.png" alt="" className="image-2" />
          </div>
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="images/Cube-1s-200px.gif" alt="" />
            </div>
          </div>
        </div>
      );
    case 'otp':
      return (
        <div className="wrapper">
          <div className="inner">
            <img src="images/myimage-1.png" alt="" className="image-1" />
            <Otp
              bankApi={props.bankApi}
              otp={props.otp}
              otpCode={props.otpCode}
              otpMobileNumber={props.otpMobileNumber}
              changeState={props.changeState}
              overlay={props.overlay}
            />
            <img src="images/myimage-2.png" alt="" className="image-2" />
          </div>
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="images/Cube-1s-200px.gif" alt="" />
            </div>
          </div>
        </div>
      );
    case 'kyc':
      return (
        <div className="wrapper">
          <div className="inner">
            <img src="images/myimage-1.png" alt="" className="image-1" />
            <Kyc
              bankApi={props.bankApi}
              changeState={props.changeState}
              overlay={props.overlay}
              onboarding={props.onboarding}
              kycDocuments={props.kycDocuments}
            />
            <img src="images/myimage-2.png" alt="" className="image-2" />
          </div>
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="images/Cube-1s-200px.gif" alt="" />
            </div>
          </div>
        </div>
      );
    default:
      return <AccountCreated tempPassword={props.tempPassword} />;
  }
}

class App extends Component {
  state = propState;

  changeState = state => {
    this.setState(state);
  };

  componentDidMount = async () => {
    let token = await localStorage.getItem('authenticated');
    console.log(token);
    if (token !== 'null' && token !== null) {
      this.changeState({authenticated: true});
    } else {
      this.changeState({authenticated: false});
      localStorage.setItem('authenticated', null);
    }
  };

  logout = e => {
    e.preventDefault();
    localStorage.setItem('authenticated', null);
    this.changeState({authenticated: false});
  };

  render() {
    if (this.state.authenticated) {
      return (
        <div>
          <h1>Hello World!</h1>
          <a href="/" onClick={this.logout}>
            <span>Logout</span>
          </a>
        </div>
      );
    } else {
      return (
        <Router>
          <Route
            exact
            path="/"
            render={() => (
              <MainPage
                bankApi={this.state.bankApi}
                login={this.state.login}
                authenticated={this.state.authenticated}
                changeState={this.changeState}
              />
            )}
          />
          <Route
            path="/onboard"
            render={() => (
              <React.Fragment>
                <OnboardSteps
                  step={this.state.step}
                  bankApi={this.state.bankApi}
                  onboarding={this.state.onboarding}
                  errors={this.state.errors}
                  regions={this.state.regions}
                  provinces={this.state.provinces}
                  cities={this.state.cities}
                  datepicker={this.state.datepicker}
                  otp={this.state.otp}
                  otpCode={this.state.otpCode}
                  otpMobileNumber={this.state.onboarding.mobileNumber}
                  changeState={this.changeState}
                  overlay={this.state.overlay}
                  kycDocuments={this.state.kycDocuments}
                  tempPassword={this.state.tempPassword}
                />
              </React.Fragment>
            )}
          />
        </Router>
      );
    }
  }
}

export default App;
