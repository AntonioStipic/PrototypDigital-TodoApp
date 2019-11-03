import React from "react";

import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TodoPage from "./pages/Todo/TodoPage";
import Navbar from "./ui-components/Navbar/Navbar";
import LoginPage from "./pages/Login/LoginPage";
import { State } from "./reducers/rootReducer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import RegisterPage from "./pages/Register/RegisterPage";

export interface AppState extends State {
  signInLocal: any;
}

class App extends React.Component<AppState> {

  componentDidMount() {
    if (localStorage.getItem("user")) {
      if (localStorage.getItem("user") !== "undefined" || localStorage.getItem("user") !== null || localStorage.getItem("user") !== "null") this.props.signInLocal(localStorage.getItem("user"));
    }

  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />

          <Switch>
            <Route exact path="/">
              {" "}
              {/* component={HomePage} */}
              {this.props.auth.uid ? <HomePage /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/login">
              {this.props.auth.uid ? <Redirect to="/" /> : <LoginPage />}
            </Route>
            <Route exact path="/register">
              {this.props.auth.uid ? <Redirect to="/" /> : <RegisterPage />}
            </Route>
            <Route exact path="/todo/">
              <Redirect to="/" />
            </Route>
            <Route path="/todo/:id" component={TodoPage}></Route>
            <Route component={HomePage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    data: state.data,
    config: state.config,
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    signInLocal: (user: any) => dispatch({ type: "SIGN_IN_LOCAL", payload: { credential: JSON.parse(user) } })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
