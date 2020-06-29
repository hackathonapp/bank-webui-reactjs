import React, { Component } from 'react';

function KycItem(props) {
  let uploadedFile = {
    backgroundImage: `url(${props.kyc.dropzoneData.objUrl})`,    
  };

  let statusClass = 'file-invalid';
  let statusLabel = 'Invalid';
  if (props.kyc.respData.isValid) {
    statusClass = 'file-valid';
    statusLabel = 'Valid';
  }

  return (
    <tr>
      <td>
        <div className="file-image" style={uploadedFile}>&nbsp;</div>
      </td>
      <td>{props.kyc.respData.ocr.kycType}</td>
      <td>{props.kyc.respData.ocr.kycRef}</td>
      <td>{props.kyc.respData.filename}</td>
      <td width="50px"><span className={statusClass}>{statusLabel}</span></td>
      <td width="50px"><span className="lnr lnr-trash remove-file" data-uuid="{props.kyc.id}" onClick={props.delKyc.bind(this, props.kyc._id)}></span></td>
    </tr>
  );
}

class KycDocument extends Component {
  componentDidMount = () => {};
  render() {
    if (this.props.kycs.length <= 0) {
      return (
        <tr>
          <td colSpan="6"><p style={{textAlign:'center',padding:'5px 0'}}>No files uploaded</p></td>
        </tr>
      );
    } else {
      return this.props.kycs.map((kyc) => {
        return <KycItem key={kyc._id} kyc={kyc} delKyc={this.props.delKyc}/>;
      });  
    }
  }
}

export default KycDocument;
