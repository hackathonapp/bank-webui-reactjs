import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../utils/Api';
import Select from '../utils/Select';

import isemail from 'isemail';

class Onboarding extends Component {
  getRegionProvinceCity = async (type, key = '') => {
    if (type === 'region') {
      let regionOptions = [];
      await API.get('/vendor/ph-address/regions.json').then(res => {
        res.data.forEach(o => {
          regionOptions.push({
            value: o.key,
            label: `${o.name} - ${o.long}`,
          });
        });
        this.props.changeState({regions: regionOptions});
        this.props.changeState({provinces: []});
        this.props.changeState({cities: []});
      });
    } else if (type === 'province') {
      let provinceOptions = [];
      API.defaults.baseURL = '';
      await API.get('/vendor/ph-address/provinces.json').then(res => {
        res.data.forEach(o => {
          if (o.region === key) {
            provinceOptions.push({
              value: o.key,
              label: o.name,
            });
          }
        });
      });
      this.props.changeState({provinces: provinceOptions});
      this.props.changeState({cities: []});
    } else if (type === 'city') {
      let cityOptions = [];
      await API.get('/vendor/ph-address/cities.json').then(res => {
        res.data.forEach(o => {
          if (o.province === key) {
            cityOptions.push({
              value: o.name,
              label: o.name,
            });
          }
        });
      });
      this.props.changeState({cities: cityOptions});
    }
  };

  onChange = e => {
    if (e.target.classList.contains('error')) this.onBlur(e);
  };

  onSelectChange = e => {
    if (e.target) e = e.target;

    const {name, value} = e;
    let errors = this.props.errors;
    let onboarding = this.props.onboarding;
    if (name === 'region') {
      onboarding['region'] = value;
      onboarding['province'] = '';
      onboarding['city'] = '';
      this.getRegionProvinceCity('province', value);
    } else if (name === 'province') {
      onboarding['province'] = value;
      onboarding['city'] = '';
      this.getRegionProvinceCity('city', value);
    } else if (name === 'city') {
      onboarding['city'] = value;
    } else {
      onboarding[name] = value;
    }

    if (value === '') {
      e.classList.add('error');
      errors[name] = 'Required';
    } else {
      e.classList.remove('error');
      errors[name] = '';
    }

    this.props.changeState({errors, [name]: value});
    this.props.changeState({onboarding});
  };

  onDateChange = date => {
    if (date != null) {
      let onboarding = this.props.onboarding;
      onboarding['birthdate'] = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      this.props.changeState({onboarding});
      this.props.changeState({datepicker: new Date(date)});
    }
  };

  onBlur = e => {
    if (e.target) e = e.target;

    const {name, value} = e;
    let errors = this.props.errors;
    let onboarding = this.props.onboarding;
    switch (name) {
      case 'firstName':
      case 'middleName':
      case 'lastName':
        if (value.length < 2) {
          errors[name] = 'Must be at least 2 characters long';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
      case 'emailAddress':
        if (!isemail.validate(value)) {
          errors[name] = 'Invalid email address';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
      case 'mobileNumber':
        const rgxMobile = /^639\d{9}$/;
        if (!rgxMobile.test(value)) {
          errors[name] = 'Invalid mobile number (639 format)';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
      case 'telephoneNumber':
        const rgxTelephone = /^632\d{8,9}$/;
        if (!rgxTelephone.test(value)) {
          errors[name] = 'Invalid telephone number (63 format)';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
      case 'monthlyIncome':
        const rgxAmount = /\d$/;
        if (!rgxAmount.test(value)) {
          errors[name] = 'Invalid amount';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
      default:
        if (value.length === 0) {
          errors[name] = 'Required';
          e.classList.add('error');
        } else {
          errors[name] = '';
          e.classList.remove('error');
        }
        break;
    }

    onboarding[name] = value;
    this.props.changeState({onboarding, [name]: value});
    this.props.changeState({errors, [name]: value});
  };

  setOnboarding = async e => {
    e.preventDefault();
    e.persist();
    Object.keys(this.props.errors).forEach(key => {
      if (key !== 'birthday') {
        if (e.target[key].tagName === 'INPUT') this.onBlur(e.target[key]);
        if (e.target[key].tagName === 'SELECT')
          this.onSelectChange(e.target[key]);
      }
    });

    let valid = true;
    Object.values(this.props.errors).forEach(
      val => val.length > 0 && (valid = false),
    );
    if (valid) {
      // POST ONBOARDING
      // e.target['submit'].setAttribute('disabled', true);
      let overlay = this.props.overlay;
      overlay['opacity'] = 1;
      overlay['zindex'] = 800;
      this.props.changeState({overlay});
      const { emailAddress } = this.props.onboarding
      if (emailAddress === undefined)
        console.log('Check email address');
      let exists = await this.checkIfExists(emailAddress);
      if (!exists) {
        API.post(
          `${this.props.bankApi.endpoint}/onboarding`,
          this.props.onboarding,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(res => {
            overlay['opacity'] = 0;
            overlay['zindex'] = 0;
            this.props.changeState({overlay});

            let bankApi = this.props.bankApi;
            bankApi['onboardingToken'] = res.data.token;
            this.props.changeState({bankApi});
            this.props.changeState({step: 'otp'});
          })
          .catch(error => {
            let code = 'ERR';
            let label = 'Unknown';
            if (error.response) {
              let err = error.response.data;
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
      } else {
        let errors = this.props.errors;
        let label = 'Please use another email address.';        
        errors['emailAddress'] = label;
        this.props.changeState({errors, ['emailAddress']: label});
        e.target['emailAddress'].classList.add('error');
        toast.error(
          <div className="toast">
            <label>
              <b>ERROR</b>
              <br />
              {label}
            </label>
          </div>,
        );
      }
      overlay['opacity'] = 0;
      overlay['zindex'] = 0;
      this.props.changeState({overlay});
    } else {
      let label = 'Please check the required fields and format';
      toast.error(
        <div className="toast">
          <label>
            <b>ERROR</b>
            <br />
            {label}
          </label>
        </div>,
      );
    }
  };

  checkIfExists = async email => {
    let res = await API.get(`${this.props.bankApi.endpoint}/clients/${email}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.data.found) return true;
        else return false;
      })
      .catch(error => {
        let code = 'ERR';
        let label = 'Unknown';
        if (error.response) {
          let err = error.response.data;
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
        return true; // default to true as the existence is unknown
      });

    return res;
  };

  componentDidMount = () => {
    console.log(this.props);
    this.getRegionProvinceCity('region');
    // this.getRegionProvinceCity('province', 'NCR');
    // this.getRegionProvinceCity('city', 'MM');
  };

  render() {
    const {
      onboarding,
      regions,
      provinces,
      cities,
      datepicker,
      errors,
    } = this.props;

    return (
      <form onSubmit={this.setOnboarding} noValidate>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h1>Account Registration</h1>
        <h2 className="col-lg-12">Personal Information</h2>
        <div className="col-lg-6 form-holder">
          <label>First Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="firstName"
            defaultValue={onboarding.firstName}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.firstName}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Middle Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="middleName"
            defaultValue={onboarding.middleName}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.middleName}</label>
        </div>
        <div className="col-lg-8 form-holder">
          <label>Last Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="lastName"
            defaultValue={onboarding.lastName}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.lastName}</label>
        </div>
        <div className="col-lg-4 form-holder">
          <label>Suffix Name</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="suffixName"
            defaultValue={onboarding.suffixName}
            onChange={this.onChange}
          />
        </div>
        <div className="col-lg-12 form-holder">
          <label>Email Address *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="emailAddress"
            defaultValue={onboarding.emailAddress}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.emailAddress}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Mobile Number *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="mobileNumber"
            defaultValue={onboarding.mobileNumber}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.mobileNumber}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Telephone Number *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="telephoneNumber"
            defaultValue={onboarding.telephoneNumber}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.telephoneNumber}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Gender *</label>
          <Select
            name="gender"
            options={[
              {value: 'Male', label: 'Male'},
              {value: 'Female', label: 'Female'},
              {value: 'Other', label: 'Other'},
            ]}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.gender}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.gender}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Civil Status *</label>
          <Select
            name="civilStatus"
            options={[
              {value: 'Single', label: 'Single'},
              {value: 'Married', label: 'Married'},
              {value: 'Separated', label: 'Separated'},
              {value: 'Widowed', label: 'Widowed'},
            ]}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.civilStatus}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.civilStatus}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Birthdate *</label>
          <div className="col-lg-12" style={{padding: 0}}>
            <DatePicker
              name="birthdate"
              showPopperArrow={false}
              showYearDropdown
              dateFormat="MMMM dd, yyyy"
              selected={datepicker}
              onChange={date => this.onDateChange(date)}
              className="form-control"
            />
            <label className="error">{errors.birthdate}</label>
          </div>
          <span className="lnr lnr-calendar-full lnr-right"></span>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Place of Birth *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="birthplace"
            defaultValue={onboarding.birthplace}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.birthplace}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Nationality *</label>
          <Select
            name="nationality"
            options={[
              {value: 'Filipino', label: 'Filipino'},
              {value: 'Non-Filipino', label: 'Non-Filipino'},
            ]}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.nationality}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
        </div>
        <div className="col-lg-12 form-holder">&nbsp;</div>
        <h2 className="col-lg-12">Current Address</h2>
        <div className="col-lg-4 form-holder">
          <label>House Number *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="address1"
            defaultValue={onboarding.address1}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.address1}</label>
        </div>
        <div className="col-lg-8 form-holder">
          <label>Street / Village / Subdivision *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="address2"
            defaultValue={onboarding.address2}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.address2}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Region *</label>
          <Select
            name="region"
            options={regions}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.region}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.region}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Province *</label>
          <Select
            name="province"
            options={provinces}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.province}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.province}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>City *</label>
          <Select
            name="city"
            options={cities}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.city}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.city}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Zip Code *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="zipcode"
            defaultValue={onboarding.zipcode}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.zipcode}</label>
        </div>
        <div className="col-lg-12 form-holder">&nbsp;</div>
        <h2 className="col-lg-12">Employment Details</h2>
        <div className="col-lg-6 form-holder">
          <label>Income Type *</label>
          <Select
            name="incomeType"
            options={[
              {value: 'Employed', label: 'Employed'},
              {value: 'Self-employed', label: 'Self-employed'},
              {value: 'Remittance / Other', label: 'Remittance / Other'},
            ]}
            handleSelectChange={this.onSelectChange}
            selectedValue={onboarding.incomeType}
          />
          <span className="lnr lnr-chevron-down lnr-right"></span>
          <label className="error">{errors.incomeType}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>TIN *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="tin"
            defaultValue={onboarding.tin}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.tin}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Employer / Business Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="employerBusiness"
            defaultValue={onboarding.employerBusiness}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.employerBusiness}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Nature of Business / Work</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="workBusinessNature"
            defaultValue={onboarding.workBusinessNature}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.workBusinessNature}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Occupation *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="occupation"
            defaultValue={onboarding.occupation}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.occupation}</label>
        </div>
        <div className="col-lg-6 form-holder">
          <label>Gross Monthly Income *</label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            autoComplete="off"
            name="monthlyIncome"
            defaultValue={onboarding.monthlyIncome}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          <label className="error">{errors.monthlyIncome}</label>
        </div>
        <div className="col-lg-12 form-holder">&nbsp;</div>
        <button name="submit" className="form-submit">
          <span>Next</span>
        </button>
      </form>
    );
  }
}

export default Onboarding;
