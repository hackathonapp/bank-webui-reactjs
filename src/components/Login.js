import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../utils/Api';

class Login extends Component {
  onChange = e => {
    const {name, value} = e.target;
    let login = this.props.login;
    login[name] = value;
    this.props.changeState({login, [name]: value});
  };

  login = async e => {
    e.preventDefault();
    const {emailAddress, password} = this.props.login;
    if (emailAddress === '' || password === '' || password.length < 8) {
      toast.error(
        <div className="toast">
          <label>Invalid email and/or password</label>
        </div>,
      );

      return;
    }
    let data = {
      emailAddress,
      password,
    };

    await API.post(`${this.props.bankApi.endpoint}/clients/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        console.log(res.data.token);
        let bankApi = this.props.bankApi;
        bankApi['onboardingToken'] = res.data.token;
        this.props.changeState({bankApi});
        this.props.changeState({authenticated: true});
        localStorage.setItem('authenticated', res.data.token);
      })
      .catch(error => {
        let code = 'ERR';
        let label = 'Unknown';
        if (error.response) {
          let err = error.response.data;
          code = `${err.error.statusCode}::${err.error.name}`;
          label = err.error.message;
        } else {
          // let o = error.toJSON();
          // label = o.message;
        }
        toast.error(
          <div className="toast">
            <label>
              <b>{label}</b>
              <br />
              {code}
            </label>
          </div>,
        );
      });
  };

  render() {
    return (
      <form className="login" onSubmit={this.login}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h1 className="cover-heading">Account Login</h1>
        <div className="col-lg-12 form-holder">
          <span className="lnr lnr-user"></span>
          <input
            type="text"
            className="form-control"
            placeholder="Email Address"
            autoComplete="off"
            name="emailAddress"
            onChange={this.onChange}
          />
        </div>
        <div className="col-lg-12 form-holder">
          <span className="lnr lnr-lock"></span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            autoComplete="off"
            name="password"
            onChange={this.onChange}
          />
        </div>
        &nbsp;
        <div className="col-lg-12 form-holder" style={{textAlign: 'left'}}>
          {/* <p>
                <a href="forgot-password">Forgot password?</a>
              </p> */}
          <p className="lead">
            Don't have an account?{' '}
            <a href="/onboard" className="signup">
              Sign up
            </a>
          </p>
        </div>
        &nbsp;
        <div className="col-lg-12 form-holder">
          <button
            name="submit"
            className="btn btn-lg btn-secondary form-submit"
          >
            <span>Sign in</span>
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
