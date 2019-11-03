import React from "react";
import { connect } from "react-redux";
import { signInAction } from "../../actions/authActions";
import { Dispatch } from "redux";
import { State } from "../../reducers/rootReducer";

import { Link } from "react-router-dom";

import "./LoginPage.css";

import loader from "../../assets/img/login_loader.gif";

export interface LoginPageState extends State {
  signIn: any;
  signInFacebook: any;
  signInGoogle: any;
  clearAuthError: any;
}

const LoginPage: React.FC<LoginPageState> = props => {
  const signIn = () => {
    let email = (document.getElementById("loginEmail") as HTMLInputElement)
      .value;

    let password = (document.getElementById(
      "loginPassword"
    ) as HTMLInputElement).value;

    props.signIn(email, password);
  };

  let clearAuthErrorTimeout: any = null;

  const clearAuthError = () => {
    clearTimeout(clearAuthErrorTimeout);
    clearAuthErrorTimeout = setTimeout(() => {
      props.clearAuthError();
    }, 8000);
  };

  // If nothing happens for a minute, delete Local Storage
  const startedLoader = () => {
    setTimeout(() => {
      localStorage.removeItem("user");

      window.location.href = "/login";
    }, 60000);
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

  const loaderHtml = props.config.showLoginLoader ? (
    <div className="loginLoader">
      <img src={loader} alt="Loader" />

      { startedLoader() }
    </div>
  ) : (
    <div />
  );

  return (
    <div className="container">
      <div className="container">
        <div className="omb_login">
          <h3 className="omb_authTitle">
            Login or <Link to="/register">Sign up</Link>
          </h3>
          <div className="row omb_row-sm-offset-3 omb_socialButtons dontShowOnMobile">
            <div className="col-xs-5 col-sm-3">
              <button
                className="loginBtn loginBtn--facebook"
                onClick={() => props.signInFacebook()}
              >
                Login with Facebook
              </button>
            </div>
            <div className="col-xs-5 col-sm-3">
              <button
                className="loginBtn loginBtn--google"
                onClick={() => props.signInGoogle()}
              >
                Login with Google
              </button>
            </div>
          </div>
          <div className="row omb_row-sm-offset-3 omb_socialButtons showOnMobile">
            <div className="col-xs-8 col-sm-6">
              <button
                className="loginBtn loginBtn--google"
                onClick={() => props.signInGoogle()}
              >
                Login with Google
              </button>
            </div>
          </div>

          <div className="row omb_row-sm-offset-3 omb_socialButtons showOnMobile">
            <div className="col-xs-8 col-sm-6">
              <button
                className="loginBtn loginBtn--facebook"
                onClick={() => props.signInFacebook()}
              >
                Login with Facebook
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
              <form className="omb_loginForm" onSubmit={signIn}>
                <input
                  className="form-control"
                  id="loginEmail"
                  type="text"
                  placeholder="Email"
                />
                <input
                  className="form-control"
                  id="loginPassword"
                  type="password"
                  placeholder="Password"
                />

                <br />
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="button"
                  onClick={signIn}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {errorMessage}

      {loaderHtml}
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
    signIn: (email: string, password: string) =>
      dispatch(signInAction(email, password)),
    signInFacebook: () => dispatch({ type: "SIGN_IN_FACEBOOK" }),
    signInGoogle: () => dispatch({ type: "SIGN_IN_GOOGLE" }),
    clearAuthError: () => dispatch({ type: "CLEAR_AUTH_ERROR" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
