import React, {Component} from 'react';
import {useDropzone} from 'react-dropzone';
import {v4 as uuidv4} from 'uuid';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignaturePad from 'react-signature-pad-wrapper';

import API from '../utils/Api';
import KycDocument from './KycDocument';

function Dropzone(props) {
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    maxSize: 3000000,
    multiple: false,
    onDropAccepted: file => {
      let kycDocuments = props.kycDocuments;
      Object.values(file).forEach(f => {
        let overlay = props.overlay;
        overlay['opacity'] = 1;
        overlay['zindex'] = 800;
        props.changeState({overlay});

        const url = URL.createObjectURL(f);
        const data = new FormData();
        data.append('file', f);
        API.post(`${props.bankApi.endpoint}/kyc/upload`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${props.bankApi.authToken}`,
          },
        })
          .then(res => {
            res.data.forEach(o => {
              let data = {
                _id: uuidv4(),
                dropzoneData: {
                  objUrl: url,
                },
                respData: o,
              };
              props.changeState({kycDocuments: [...kycDocuments, data]});

              overlay['opacity'] = 0;
              overlay['zindex'] = -1;
              props.changeState({overlay});
            });
          })
          .catch(error => {
            overlay['opacity'] = 0;
            overlay['zindex'] = -1;
            props.changeState({overlay});

            let o = error.toJSON();
            console.log(o);

            let label = o.message;
            toast.error(
              <div className="toast">
                <label>
                  <b>ERROR</b>
                  <br />
                  {label}
                </label>
              </div>,
            );
          });
      });
    },
  });

  return (
    <section>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag and drop file here, or click to select file</p>
      </div>
    </section>
  );
}

class Kyc extends Component {
  delKyc = id => {
    let kycDocuments = this.props.kycDocuments;
    this.props.changeState({
      kycDocuments: [...kycDocuments.filter(kyc => kyc._id !== id)],
    });
  };

  validateForm = async e => {
    e.preventDefault();
    // check kycDocument if has a valid upload
    let valid = false;
    Object.values(this.props.kycDocuments).forEach(val => {
      val.respData.isValid && (valid = true);
    });
    if (!valid) {
      toast.error(
        <div className="toast">
          <label>
            <b>Error</b>
            <br />
            Please upload a valid KYC document.
          </label>
        </div>,
      );
      return;
    }

    let overlay = this.props.overlay;
    overlay['opacity'] = 1;
    overlay['zindex'] = 800;
    this.props.changeState({overlay});
    // post /client to get client id
    let client = await this.createClient(e);
    if (client) {
      // post each validkycdocument to the client using the id
      Object.values(this.props.kycDocuments).forEach(val => {
        if (val.respData.isValid) {
          this.assignKycToClient(e, val.respData.ocr);
        }
      });

      // post each specimen signature to the client using the id
      this.uploadSigSpecimen(this.signaturePad1.toDataURL());
      this.uploadSigSpecimen(this.signaturePad2.toDataURL());
      this.uploadSigSpecimen(this.signaturePad3.toDataURL());
      this.uploadSigSpecimen(this.signaturePad4.toDataURL());

      this.props.changeState({step: 'done'});
    }
    overlay['opacity'] = 0;
    overlay['zindex'] = -1;
    this.props.changeState({overlay});
  };

  createClient = async e => {
    let resp = await API.post(
      `${this.props.bankApi.endpoint}/clients`,
      this.props.onboarding,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.bankApi.authToken}`,
        },
      },
    )
      .then(res => {
        console.log(res);
        let bankApi = this.props.bankApi;
        bankApi['clientId'] = res.data.clientId;
        this.props.changeState({bankApi});
        this.props.changeState({tempPassword: res.data.password});
        return true;
      })
      .catch(error => {
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
        return false;
      });

    return resp;
  };

  assignKycToClient = async (e, kyc) => {
    await API.post(
      `${this.props.bankApi.endpoint}/clients/${this.props.bankApi.clientId}/kyc`,
      kyc,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.bankApi.authToken}`,
        },
      },
    )
      .then(res => {
        // let bankApi = this.props.bankApi;
        // bankApi['clientId'] = res.data.clientId;
        // this.props.changeState({bankApi});
        return true;
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

    return false;
  };

  uploadSigSpecimen = signature => {
    let arr = signature.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], 'signature.png', {type: mime});

    const data = new FormData();
    data.append('file', file);
    API.post(
      `${this.props.bankApi.endpoint}/clients/${this.props.bankApi.clientId}/signature`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.bankApi.authToken}`,
        },
      },
    )
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        // overlay['opacity'] = 0;
        // overlay['zindex'] = 0;
        // props.changeState({overlay});

        // let o = error.toJSON();
        // console.log(o);

        // let label = o.message;
        // toast.error(
        //   <div className="toast">
        //     <label>
        //       <b>ERROR</b>
        //       <br />
        //       {label}
        //     </label>
        //   </div>,
        // );
      });
  };

  componentDidMount = () => {
    let overlay = this.props.overlay;
    overlay['opacity'] = 0;
    overlay['zindex'] = -1;
    this.props.changeState({overlay});
  };

  render() {
    return (
      <form className="dz-wrapper" onSubmit={this.validateForm}>
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
        <div className="form-holder">
          <h2>Upload KYC Documents</h2>
          <Dropzone
            kycDocuments={this.props.kycDocuments}
            changeState={this.props.changeState}
            overlay={this.props.overlay}
            bankApi={this.props.bankApi}
          />
        </div>
        <div className="form-holder">
          <table className="dataTable">
            <thead>
              <tr>
                <th width="70px"></th>
                <th>ID Type</th>
                <th>ID Number</th>
                <th>Filename</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <KycDocument
                kycs={this.props.kycDocuments}
                delKyc={this.delKyc}
              />
            </tbody>
          </table>
          <span className="invalid-note">
            *Invalid files will be removed on submit
          </span>
        </div>
        <div className="form-holder dpz">
          <h2>Specimen Signature</h2>
          <label>Please sign within the dotted border line</label>
          <div className="specimen-sign">
            <SignaturePad
              ref={ref => (this.signaturePad1 = ref)}
              height={200}
            />
          </div>
          <h4 style={{textAlign: 'center'}}>Signature 1</h4>
          <div className="specimen-sign">
            <SignaturePad
              ref={ref => (this.signaturePad2 = ref)}
              height={200}
            />
          </div>
          <h4 style={{textAlign: 'center'}}>Signature 2</h4>
          <div className="specimen-sign">
            <SignaturePad
              ref={ref => (this.signaturePad3 = ref)}
              height={200}
            />
          </div>
          <h4 style={{textAlign: 'center'}}>Signature 3</h4>
          <div className="specimen-sign">
            <SignaturePad
              ref={ref => (this.signaturePad4 = ref)}
              height={200}
            />
          </div>
          <h4 style={{textAlign: 'center'}}>Signature 4</h4>
        </div>
        <div className="container" style={{margin: '70px 0 30px 0'}}>
          <button name="submit" className="btn btn-primary form-submit">
            <span>Submit</span>
          </button>
        </div>
      </form>
    );
  }
}

export default Kyc;
