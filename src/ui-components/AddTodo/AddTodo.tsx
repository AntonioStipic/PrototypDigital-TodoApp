import React from "react";
import { Dispatch } from "redux";
import {
  toggleAddTodoComponentAction,
  addTodoAction
} from "../../actions/todoActions";

import "./AddTodo.css";
import { connect } from "react-redux";
import { State } from "../../reducers/rootReducer";

export interface AddTodoState extends State {
  toggleAddTodoComponent: any;
  addTodo: any;
}

class AddTodo extends React.Component<AddTodoState> {
  createTodo = () => {
    let title = (document.getElementById("todoTitle") as HTMLInputElement).value;
    let body = (document.getElementById("todoBody") as HTMLInputElement).value;

    this.props.addTodo(title, body, this.props.auth.uid);
    this.props.toggleAddTodoComponent();
  };

  render() {
    return (
      <div id="addTodoComponent">
        <div
          className="overlay"
          onClick={() => this.props.toggleAddTodoComponent()}
        ></div>
        <div className="content">
          <form onSubmit={() => this.createTodo()}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                className="form-control"
                id="todoTitle"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea className="form-control" id="todoBody"></textarea>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.props.toggleAddTodoComponent()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.createTodo}
            >
              Add
            </button>
          </form>
        </div>
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
    addTodo: (title: string, body: string, userId: string) =>
      dispatch(addTodoAction(title, body, userId)),
    toggleAddTodoComponent: () => dispatch(toggleAddTodoComponentAction())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTodo);
