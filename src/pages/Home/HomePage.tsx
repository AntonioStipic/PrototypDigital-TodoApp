import React from "react";

import { State, TodoInterface, initState } from "../../reducers/rootReducer";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { datePipe } from "../../pipes/datePipe";
import { truncateTextPipe } from "../../pipes/truncateTextPipe";
import { Dispatch } from "redux";
import {
  removeTodoById,
  toggleAddTodoComponentAction,
  toggleTodoViewAction,
  toggleSortByAction,
  updateSortedTodosAction
} from "../../actions/todoActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faGripHorizontal,
  faThList,
  faSort,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

import "./HomePage.css";

import AddTodo from "../../ui-components/AddTodo/AddTodo";

import loader from "../../assets/img/login_loader.gif";

export interface HomePageState extends State {
  removeTodoById: any;
  toggleAddTodoComponent: any;
  toggleTodoView: any;
  toggleSortBy: any;
  updateSortedTodos: any;
  toggleShowHomeLoader: any;
}

class HomePage extends React.Component<HomePageState> {
  interval: any;
  closeLoader: any;

  sortTodos = (todos: any) => {
    let sortedTodos = [...todos];
    let coeficient: number = this.props.config.sortNewToOld ? -1 : 1;

    sortedTodos.sort((a, b): any => {
      if (a.timestamp < b.timestamp) return -1 * coeficient;
      if (a.timestamp > b.timestamp) return 1 * coeficient;
      else return 0;
    });

    return sortedTodos;
  };

  searchMap = (todo: TodoInterface) => {
    let search = "";

    try {
      search = (document.getElementById(
        "searchBar"
      ) as HTMLInputElement).value.toLowerCase();
    } catch (err) {
      search = "";
    } finally {
    }

    return todo.body.toLowerCase().includes(search) ||
      todo.title.toLowerCase().includes(search)
      ? todo
      : null;
  };

  searchBarHandler = (event: any = "", force = false) => {
    if (!force) {
      let sortedTodos = this.sortTodos(
        this.props.data.todos
          .map(this.searchMap)
          .filter((todo: any) => todo !== null)
      );
      this.props.updateSortedTodos(sortedTodos);
    } else {
      let sortedTodos = this.sortTodos(this.props.data.todos);

      this.props.updateSortedTodos(sortedTodos);
    }
  };

  componentDidMount() {
    this.searchBarHandler(null, true);
    this.interval = setInterval(() => {
      this.searchBarHandler(null, true);
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleSortBy = () => {
    this.props.toggleSortBy();

    setTimeout(() => this.searchBarHandler(), 1000);
  };

  componentDidUpdate(prevProps: any) {
    if (
      prevProps.data.todos[0] !== initState.data.todos[0] &&
      this.props.config.showHomeLoader
    ) {
      this.props.toggleShowHomeLoader();
    }

    if (prevProps.data.todos !== this.props.data.todos) {
      this.searchBarHandler(null, true);
    }
  }

  render() {
    return (
      <div className="container" id="homePageContainer">
        <div className="subNavbar">
          <div className="input-group mb-3 searchBar">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              id="searchBar"
              onChange={this.searchBarHandler}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-default subNavbarButton"
            onClick={this.props.toggleTodoView}
          >
            <FontAwesomeIcon
              icon={this.props.config.viewAsList ? faGripHorizontal : faThList}
            />
          </button>
          <button
            type="button"
            className="btn btn-default subNavbarButton"
            onClick={this.toggleSortBy}
          >
            <FontAwesomeIcon icon={faSort} />
          </button>
        </div>

        {this.props.data.sortedTodos.length ? (
          this.props.config.viewAsList ? (
            <div className="list-group">
              {this.props.data.sortedTodos.map(
                (todo: TodoInterface, index: number) => {
                  return todo.owner !== "" ? (
                    <Link
                      key={todo.id}
                      to={"/todo/" + todo.id}
                      className={
                        "list-group-item list-group-item-action list-group-item-" +
                        this.props.data.colors[index]
                      }
                    >
                      <span className={todo.finished ? "strike" : ""}>
                        {truncateTextPipe(todo.title)}
                      </span>
                      <span className="badge badge-primary badge-pill float-right mt-1">
                        {datePipe(todo.timestamp)}
                      </span>
                    </Link>
                  ) : (
                    <div key={todo.id} />
                  );
                }
              )}
            </div>
          ) : (
            <div className="row justify-content-center">
              {this.props.data.sortedTodos.map(
                (todo: TodoInterface, index: number) => {
                  return todo.owner !== "" ? (
                    <Link
                      key={todo.id}
                      to={"/todo/" + todo.id}
                      className={"col-md-3 customCard"}
                    >
                      <div
                        className={
                          "card text-white bg-" + this.props.data.colors[index]
                        }
                      >
                        <h5
                          className={`card-header ${
                            todo.finished ? "strike" : ""
                          }`}
                        >
                          {truncateTextPipe(todo.title)}
                        </h5>
                        <div className="card-body">
                          <p className="card-text msg-wrapper">
                            {truncateTextPipe(todo.body)}
                          </p>
                        </div>
                        <div className="card-footer">
                          {datePipe(todo.timestamp)}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div key={todo.id} />
                  );
                }
              )}
            </div>
          )
        ) : (
          <p>No todos left!</p>
        )}

        {this.props.config.toggleAddTodoComponent ? <AddTodo /> : <div></div>}

        <button
          type="button"
          className="btn btn-primary btn-circle btn-xl fixedRight"
          onClick={() => this.props.toggleAddTodoComponent()}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        {this.props.config.showHomeLoader ? (
          <div className="homeLoader">
            <img src={loader} alt="Loader" />
          </div>
        ) : (
          <div />
        )}
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
    removeTodoById: (id: string) => dispatch(removeTodoById(id)),
    toggleAddTodoComponent: () => dispatch(toggleAddTodoComponentAction()),
    toggleTodoView: () => dispatch(toggleTodoViewAction()),
    toggleSortBy: () => dispatch(toggleSortByAction()),
    updateSortedTodos: (todos: any) => dispatch(updateSortedTodosAction(todos)),
    toggleShowHomeLoader: () => dispatch({ type: "TOGGLE_SHOW_HOME_LOADER" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
