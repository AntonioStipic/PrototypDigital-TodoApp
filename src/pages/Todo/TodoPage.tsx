import React from "react";

import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { State, TodoInterface } from "../../reducers/rootReducer";
import { Dispatch } from "redux";
import { removeTodoById, updateTodoByIdAction } from "../../actions/todoActions";

import "./TodoPage.css";

export interface TodoPageState extends State {
  removeTodoById: any;
  updateTodoById: any;
}

const TodoPage: React.FC<TodoPageState & RouteComponentProps<any>> = props => {
  let todo: TodoInterface[] = props.data.todos.filter(
    (todo: TodoInterface) => {
      return todo.id === props.match.params.id;
    }
  );

  const updateTodo = (id: string) => {
    let title = (document.getElementById("todoTitle") as HTMLInputElement).value;
    let body = (document.getElementById("todoBody") as HTMLInputElement).value;
    let checked = (document.getElementById("todoChecked") as HTMLInputElement).checked;

    props.updateTodoById(id, title, body, checked);
  }

  const removeTodoById = (id: string) => {
    props.removeTodoById(id);

    props.history.push("/");
  }

  const body =
    todo.length === 1 ? (
      <div className="msg-wrapper">
        <div className="card bg-light mb-3 todoInfo">
          <div className="card-header">Todo Info</div>
          <div className="card-body">
              <div className="form-group row justify-content-center">
                <strong className="col-sm-4 col-form-label">Title:</strong>
                <div className="col-sm-6">
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={todo[0].title}
                    id="todoTitle"
                  />
                </div>
              </div>
              <div className="form-group row justify-content-center">
                <strong className="col-sm-4 col-form-label">Description:</strong>
                <div className="col-sm-6">
                  <textarea className="form-control" defaultValue={todo[0].body} id="todoBody"></textarea>
                </div>
              </div>

              <div className="form-group row justify-content-center">
                <strong className="col-sm-4 col-form-label">Finished:</strong>
                <div className="col-sm-6">
                <input type="checkbox" className="form-control form-check-input" defaultChecked={todo[0].finished} id="todoChecked" />
                </div>
              </div>
              <br /> <br />

              <div className="row justify-content-center">
              <button className="form-control btn-danger col-sm-5 m-2" onClick={() => removeTodoById(todo[0].pathId)}>Delete</button>
                <button className="form-control btn-primary col-sm-5 m-2" onClick={() => updateTodo(todo[0].pathId)}>Save</button>
              </div>
          </div>
        </div>
      </div>
    ) : (
      <div>Could not find Todo!</div>
    );

  return (
    <div className="container" id="todoPageContainer">
      {body}
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
    removeTodoById: (id: string) => dispatch(removeTodoById(id)),
    updateTodoById: (id: string, title: string, body: string, finished: boolean) => dispatch(updateTodoByIdAction(id, title, body, finished))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoPage);
