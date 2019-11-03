import React from "react";
import { connect } from "react-redux";
import { signUpAction } from "../../actions/authActions";
import { Dispatch } from "redux";
import { State } from "../../reducers/rootReducer";

import { Link } from "react-router-dom";

import "./RegisterPage.css";

export interface RegisterPageState extends State {
  signUp: any;
  signInFacebook: any;
  signInGoogle: any;
  clearAuthError: any;
}

const RegisterPage: React.FC<RegisterPageState> = props => {
  const signUp = () => {
    let email = (document.getElementById("registerEmail") as HTMLInputElement)
      .value;

    let password = (document.getElementById(
      "registerPassword"
    ) as HTMLInputElement).value;

    props.signUp(email, password);
  };

  let clearAuthErrorTimeout: any = null;

  const clearAuthError = () => {
    clearTimeout(clearAuthErrorTimeout);
    clearAuthErrorTimeout = setTimeout(() => {
      props.clearAuthError();
    }, 8000);
  };

  const errorMessage = props.auth.error ? (
    <div className="alert alert-danger showAndHide errorMessage" role="alert">
      {props.auth.error.message}

      {/* Call function to remove error so new one can appear */}
      {clearAuthError()}
    </div>
  ) : (
    <div />
  );

  return (
    <div className="container">
      <div className="container">
        <div className="omb_login">
          <h3 className="omb_authTitle">
          <Link to="/login">Login</Link> or Sign up
          </h3>
          <div className="row omb_row-sm-offset-3 omb_socialButtons dontShowOnMobile">
            <div className="col-xs-5 col-sm-3">
              <button
                className="loginBtn loginBtn--facebook"
                onClick={() => props.signInFacebook()}
              >
                Sign Up with Facebook
              </button>
            </div>
            <div className="col-xs-5 col-sm-3">
              <button
                className="loginBtn loginBtn--google"
                onClick={() => props.signInGoogle()}
              >
                Sign Up with Google
              </button>
            </div>
          </div>
          <div className="row omb_row-sm-offset-3 omb_socialButtons showOnMobile">
            <div className="col-xs-8 col-sm-6">
              <button
                className="loginBtn loginBtn--google"
                onClick={() => props.signInGoogle()}
              >
                Sign Up with Google
              </button>
            </div>
          </div>

          <div className="row omb_row-sm-offset-3 omb_socialButtons showOnMobile">
            <div className="col-xs-8 col-sm-6">
            <button
                className="loginBtn loginBtn--facebook"
                onClick={() => props.signInFacebook()}
              >
                Sign Up with Facebook
              </button>
            </div>
          </div>

          <div className="row omb_row-sm-offset-3 omb_loginOr">
            <div className="col-xs-12 col-sm-6">
              <hr className="omb_hrOr" />
              <span className="omb_spanOr">or</span>
            </div>
          </div>

          <div className="row omb_row-sm-offset-3">
            <div className="col-xs-12 col-sm-6">
              <form className="omb_loginForm" onSubmit={signUp}>
                <input className="form-control" id="registerEmail" type="text" placeholder="Email"/>
                <input
                  className="form-control"
                  id="registerPassword"
                  type="password"
                  placeholder="Password"
                />

                <br />
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="button"
                  onClick={signUp}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {errorMessage}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    data: state.data,
    config: state.config,
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    signUp: (email: string, password: string) =>
      dispatch(signUpAction(email, password)),
    signInFacebook: () => dispatch({ type: "SIGN_IN_FACEBOOK" }),
    signInGoogle: () => dispatch({ type: "SIGN_IN_GOOGLE" }),
    clearAuthError: () => dispatch({ type: "CLEAR_AUTH_ERROR" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPage);
