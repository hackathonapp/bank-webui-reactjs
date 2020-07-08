import React, { Component } from 'react';

class Terms extends Component {
  check = e => { 
    let terms = this.props.terms;
    terms = e.target.checked;
    this.props.changeState({terms});
  };

  next = e => {
    e.preventDefault();
    if (this.props.terms) {
      this.props.changeState({step: 'onboarding'});
    }
  }

  render() {
    return (
      <div
        className="container"
        style={{
          textAlign: 'left',
          fontWeight: '100',          
          fontSize: '14px',
        }}
      >
        <form>
          <h5>Terms and Conditions</h5>
          <div className="terms">
            <small>*for demonstration purposes only</small>

            <h6>I. Introduction</h6>
            <p>
              These Website Standard Terms and Conditions written on this
              webpage shall manage your use of our website, CloudFive Demo App
              accessible at https://www.fakeurl.demo/hackathonapp.
            </p>
            <p>
              These Terms will be applied fully and affect to your use of this
              Website. By using this Website, you agreed to accept all terms and
              conditions written in here. You must not use this Website if you
              disagree with any of these Website Standard Terms and Conditions.
              These Terms and Conditions have been generated with the help of
              the Terms And Conditions Template and the Terms and Conditions
              Generator.
            </p>
            <p>
              Minors or people below 18 years old are not allowed to use this
              Website.
            </p>
            <h6>II. Intellectual Property Rights</h6>
            <p>
              Other than the content you own, under these Terms,
              CC_UC-4-CloudFive and/or its licensors own all the intellectual
              property rights and materials contained in this Website.
            </p>
            <p>
              You are granted limited license only for purposes of viewing the
              material contained on this Website.
            </p>
            <h6>III. Restrictions</h6>
            <p>You are specifically restricted from all of the following:</p>
            <ul>
              <li>publishing any Website material in any other media;</li>
              <li>
                selling, sublicensing and/or otherwise commercializing any
                Website material;
              </li>
              <li>publicly performing and/or showing any Website material;</li>
              <li>
                using this Website in any way that is or may be damaging to this
                Website;
              </li>
              <li>
                using this Website in any way that impacts user access to this
                Website;
              </li>
              <li>
                using this Website contrary to applicable laws and regulations,
                or in any way may cause harm to the Website, or to any person or
                business entity;
              </li>
              <li>
                engaging in any data mining, data harvesting, data extracting or
                any other similar activity in relation to this Website;
              </li>
              <li>
                using this Website to engage in any advertising or marketing.
              </li>
            </ul>
            <p>
              Certain areas of this Website are restricted from being access by
              you and CC_UC-4-CloudFive may further restrict access by you to
              any areas of this Website, at any time, in absolute discretion.
              Any user ID and password you may have for this Website are
              confidential and you must maintain confidentiality as well.
            </p>
            <h6>IV. Your Content</h6>
            <p>
              In these Website Standard Terms and Conditions, "Your Content"
              shall mean any audio, video text, images or other material you
              choose to display on this Website. By displaying Your Content, you
              grant CC_UC-4-CloudFive a non-exclusive, worldwide irrevocable,
              sub licensable license to use, reproduce, adapt, publish,
              translate and distribute it in any and all media.
            </p>
            <p>
              Your Content must be your own and must not be invading any
              third-party’s rights. CC_UC-4-CloudFive reserves the right to
              remove any of Your Content from this Website at any time without
              notice.
            </p>
            <h6>V. Your Privacy</h6>
            <p>Please read Privacy Policy.</p>
            <h6>VI. No warranties</h6>
            <p>
              This Website is provided "as is," with all faults, and
              CC_UC-4-CloudFive express no representations or warranties, of any
              kind related to this Website or the materials contained on this
              Website. Also, nothing contained on this Website shall be
              interpreted as advising you.
            </p>
            <h6>VII. Limitation of liability</h6>
            <p>
              In no event shall CC_UC-4-CloudFive, nor any of its officers,
              directors and employees, shall be held liable for anything arising
              out of or in any way connected with your use of this Website
              whether such liability is under contract. CC_UC-4-CloudFive,
              including its officers, directors and employees shall not be held
              liable for any indirect, consequential or special liability
              arising out of or in any way related to your use of this Website.
            </p>
            <h6>VIII. Indemnification</h6>
            <p>
              You hereby indemnify to the fullest extent CC_UC-4-CloudFive from
              and against any and/or all liabilities, costs, demands, causes of
              action, damages and expenses arising in any way related to your
              breach of any of the provisions of these Terms.
            </p>
            <h6>IX. Severability</h6>
            <p>
              If any provision of these Terms is found to be invalid under any
              applicable law, such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>
            <h6>X. Variation of Terms</h6>
            <p>
              CC_UC-4-CloudFive is permitted to revise these Terms at any time
              as it sees fit, and by using this Website you are expected to
              review these Terms on a regular basis.
            </p>
            <h6>XI. Assignment</h6>
            <p>
              The CC_UC-4-CloudFive is allowed to assign, transfer, and
              subcontract its rights and/or obligations under these Terms
              without any notification. However, you are not allowed to assign,
              transfer, or subcontract any of your rights and/or obligations
              under these Terms.
            </p>
            <h6>XII. Entire Agreement</h6>
            <p>
              These Terms constitute the entire agreement between
              CC_UC-4-CloudFive and you in relation to your use of this Website,
              and supersede all prior agreements and understandings.
            </p>
            <h6>XIII. Governing Law & Jurisdiction</h6>
            <p>
              These Terms will be governed by and interpreted in accordance with
              the laws of the State of ph, and you submit to the non-exclusive
              jurisdiction of the state and federal courts located in ph for the
              resolution of any disputes.
            </p>
          </div>
          <div>
            <div className="row col-lg-12">&nbsp;</div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="accept"
                onChange={this.check}
              />
              <label className="custom-control-label" htmlFor="accept">
                I have read and understood the terms and conditions declared
                herein.
              </label>
            </div>
            <div className="row col-lg-12">&nbsp;</div>
            <div className="row col-lg-12">
              <button
                name="submit"
                className="btn btn-primary form-submit"
                onClick={this.next}
              >
                <span>Next</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Terms;
