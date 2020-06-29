import React, { Component } from 'react';
class Select extends Component {
  // constructor(props) {
  //   super(props);
  // }

  // On the change event for the select box pass the selected value back to the parent
  handleChange = (event) => {
    this.props.handleSelectChange(event);
  };

  render() {    
    let arrayOfData = this.props.options || [];
    let options = arrayOfData.map((data) => (
      <option key={data.value} value={data.value} >
        {data.label}
      </option>
    ));

    return (
      <select
        name={this.props.name}        
        className="form-control"
        onChange={this.handleChange}
        value={this.props.selectedValue}
      >
        <option></option>
        {options}
      </select>
    );
  }
}

export default Select;
