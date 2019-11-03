import React from "react";

import { NavLink, Link } from "react-router-dom";

import "./Navbar.css";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { signOutAction } from "../../actions/authActions";
import { State } from "../../reducers/rootReducer";

import logo from "../../assets/img/logo.png"

export interface NavbarState extends State {
  signOut: any;
}

const Navbar: React.FC<NavbarState> = props => {

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} className="logoImg" alt="Logo" />
          </Link>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">

              {props.auth.uid ? (
                <NavLink exact to="/" className="nav-item nav-link p-r">
                  HOME
                </NavLink>
              ) : (
                <div />
              )}

              {props.auth.uid ? (
                <div
                  onClick={() => props.signOut()}
                  className="nav-item nav-link p-r pointerCursor"
                >
                  LOG OUT
                </div>
              ) : (
                <div />
              )}

              {!props.auth.uid ? (
                <NavLink to="/login" className="nav-item nav-link p-r">
                  LOGIN
                </NavLink>
              ) : (
                <div />
              )}

              {!props.auth.uid ? (
                <NavLink to="/register" className="nav-item nav-link p-r">
                  REGISTER
                </NavLink>
              ) : (
                <div />
              )}
            </ul>
          </div>
        </div>
      </nav>
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
    signOut: () => dispatch(signOutAction())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
