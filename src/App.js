import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Otp from './components/Otp';
import Kyc from './components/Kyc';
import AccountCreated from './components/AccountCreated';
import propState from './props';
import MainPage from './components/MainPage';
import Login from './components/Login';
import Terms from './components/pages/Terms';

function OnboardSteps(props) {    
  let overlay = {
    opacity: props.overlay.opacity,
    zIndex: props.overlay.zindex,
  };

  switch (props.step) {
    case 'tc':
      return (
        <div className="onboarding">
          <Terms 
            terms={props.terms} 
            changeState={props.changeState} />
        </div>
      );
    case 'onboarding':
      document.body.classList.add('full');      
      return (
        <div className="onboarding">
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
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="./assets/brand/cloud.svg" alt="" />
            </div>
          </div>
        </div>
      );
    case 'otp':      
      return (
        <div className="onboarding otp">
          <Otp
            bankApi={props.bankApi}
            otp={props.otp}
            otpCode={props.otpCode}
            otpMobileNumber={props.otpMobileNumber}
            changeState={props.changeState}
            overlay={props.overlay}
          />
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="./assets/brand/cloud.svg" alt="" />
            </div>
          </div>
        </div>
      );
    case 'kyc':
      document.body.classList.add('full2');
      return (
        <div className="onboarding kyc">
          <Kyc
            bankApi={props.bankApi}
            changeState={props.changeState}
            overlay={props.overlay}
            onboarding={props.onboarding}
            kycDocuments={props.kycDocuments}
          />
          <div style={overlay} className="overlay">
            <div className="loading">
              <img src="./assets/brand/cloud.svg" alt="" />
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
    // console.log(token);
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
    document.body.classList.remove('full');
    document.body.classList.remove('full2');  
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
            exact
            path="/login"
            render={() => (
              <Login
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
                  terms={this.state.terms}
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
