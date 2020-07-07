import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../utils/Api';

class Otp extends Component {
  onKeyUp = e => {
    let otp = this.props.otp;
    var isnum = /^\d+$/.test(e.target.value);
    if (isnum) {
      otp[e.target.name] = e.target.value.substring(0, 1);
      this.props.changeState({otp});
      if (e.target.name !== 'i6') e.target.nextSibling.focus();
    } else {
      e.target.value = '';
    }

    if (e.key === 'Backspace') {
      if (e.target.value === '') {
        if (e.target.name !== 'i1') e.target.previousSibling.focus();
      }
    }
  };

  validateForm = e => {
    e.preventDefault();
    let otp = '';
    Object.values(this.props.otp).forEach(val => {
      otp = otp + val;
    });
    if (otp.length === 6) {
      // POST ONBOARDING
      // e.target['submit'].setAttribute('disabled', true);
      this.validateOtp(e, otp);
    } else {
      let label = 'Please enter 6 digit pin';
      toast.error(
        <div className="toast">
          <label>
            <b>ERROR</b>
            <br />
            {label}
          </label>
        </div>,
        {
          autoClose: 3000,
        },
      );
    }
  };

  validateOtp = (e, otp) => {
    let overlay = this.props.overlay;
    overlay['opacity'] = 1;
    overlay['zindex'] = 800;
    this.props.changeState({overlay});

    let data = {
      token: this.props.bankApi.onboardingToken,
      otp,
    };
    API.post(`${this.props.bankApi.endpoint}/otp/verify`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        overlay['opacity'] = 0;
        overlay['zindex'] = -1;
        this.props.changeState({overlay});

        if (!res.data.valid) {
          toast.error(
            <div className="toast">
              <label>
                <b>Error</b>
                <br />
                You've entered an invalid OTP code
              </label>
            </div>,
          );
        } else {
          let bankApi = this.props.bankApi;
          bankApi['authToken'] = res.data.authToken;
          this.props.changeState({bankApi});
          this.props.changeState({step: 'kyc'});
        }
      })
      .catch(error => {
        overlay['opacity'] = 0;
        overlay['zindex'] = -1;
        this.props.changeState({overlay});

        let code = 'ERR';
        let label = 'Unknown';
        if (error.response) {
          let err = error.response.data;
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          code = `${err.error.statusCode}::${err.error.name}`;
          label = err.error.message;
        } else {
          let o = error.toJSON();
          label = o.message;
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

  getOtp = (explicit = false) => {
    let overlay = this.props.overlay;
    overlay['opacity'] = 1;
    overlay['zindex'] = 800;
    this.props.changeState({overlay});

    API.post(
      `${this.props.bankApi.endpoint}/onboarding/${this.props.bankApi.onboardingToken}/otp`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => {
        overlay['opacity'] = 0;
        overlay['zindex'] = -1;
        this.props.changeState({overlay});
        this.props.changeState({otpCode: res.data.otp});

        if (explicit)
          toast.info(
            <div className="toast">
              <label>We've sent you your OTP to your mobile phone.</label>
            </div>,
          );
      })
      .catch(error => {
        overlay['opacity'] = 0;
        overlay['zindex'] = -1;
        this.props.changeState({overlay});

        let code = 'ERR';
        let label = 'Unknown';
        if (error.response) {
          let err = error.response.data;
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          code = `${err.error.statusCode}::${err.error.name}`;
          label = err.error.message;
        } else {
          let o = error.toJSON();
          label = o.message;
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

  componentDidMount = () => {
    this.getOtp(false);
  };

  render() {
    const {otp} = this.props;
    return (
      <div>
        <div className="flash-demo">
          For the purpose of demonstration, the OTP is being shown here - [
          <label>{this.props.otpCode}</label>]
        </div>
        <form onSubmit={this.validateForm} noValidate>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="otp-image">
            <img src="images/myimage-3.png" alt="" className="image-3" />
            <h2>
              OTP has been sent to you on your
              <br />
              mobile phone
            </h2>
            <div className="otp-number">+{this.props.otpMobileNumber}</div>
            <h2>Enter 6 Digit Pin</h2>
          </div>
          <div className="form-holder otp-group">
            <input
              type="text"
              name="i1"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i1}
              onKeyUp={this.onKeyUp}
            />
            <input
              type="text"
              name="i2"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i2}
              onKeyUp={this.onKeyUp}
            />
            <input
              type="text"
              name="i3"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i3}
              onKeyUp={this.onKeyUp}
            />
            <input
              type="text"
              name="i4"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i4}
              onKeyUp={this.onKeyUp}
            />
            <input
              type="text"
              name="i5"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i5}
              onKeyUp={this.onKeyUp}
            />
            <input
              type="text"
              name="i6"
              className="form-control otp-digit"
              maxLength="1"
              defaultValue={otp.i6}
              onKeyUp={this.onKeyUp}
            />
          </div>
          <div className="form-holder">&nbsp;</div>
          <div className="otp-image">
            <p className="lead">
              Didn't get OTP?{' '}
              <span
                className="resend-otp"
                onClick={this.getOtp.bind(this, true)}
              >
                RESEND CODE
              </span>
            </p>
          </div>
          <div className="form-holder">
            <input type="hidden" id="otp" name="otp" value="" />
          </div>
          <div className="container text-center" style={{marginTop: '70px'}}>
            <button name="submit" className="btn btn-primary form-submit">
              <span>Next</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Otp;
