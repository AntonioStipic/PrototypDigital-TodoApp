export const initState = {
  data: {
    todos: [
      {
        title: "",
        body: "",
        id: "",
        timestamp: "0",
        owner: "",
        finished: false,
        pathId: ""
      }
    ],
    sortedTodos: [
      {
        title: "",
        body: "",
        id: "",
        timestamp: "0",
        owner: "",
        finished: false,
        pathId: ""
      }
    ],
    colors: []
  },
  config: {
    toggleAddTodoComponent: false,
    viewAsList: false,
    sortNewToOld: true,
    showLoginLoader: false,
    showHomeLoader: true
  },
  auth: {
    uid: null,
    error: null
  }
};

export interface State {
  data: {
    todos: TodoInterface[];
    sortedTodos: TodoInterface[];
    colors: any;
  };
  config: {
    toggleAddTodoComponent: boolean;
    viewAsList: boolean;
    sortNewToOld: boolean;
    showLoginLoader: boolean;
    showHomeLoader: boolean;
  };
  auth: any;
}

export interface CustomAction {
  type: string;
  payload?: any;
  action?: any;
}

export interface TodoInterface {
  title: string;
  body: string;
  id: string;
  timestamp: string;
  owner: string;
  finished: boolean;
  pathId: string;
}

export const rootReducer = (state = initState, action: CustomAction): State => {
  switch (action.type) {
    case "UPDATE_SORTED_TODOS": {
      let newTodos = action.payload.todos;

      return {
        ...state,
        data: {
          ...state.data,
          sortedTodos: newTodos
        }
      };
    }
    case "ADD_TODO_ASYNC": {
      return state;
    }
    case "TOGGLE_ADDTODO_COMPONENT": {
      let newToggle = !state.config.toggleAddTodoComponent;

      return {
        ...state,
        config: {
          ...state.config,
          toggleAddTodoComponent: newToggle
        }
      };
    }
    case "TOGGLE_TODO_VIEW": {
      let newToggle = !state.config.viewAsList;

      return {
        ...state,
        config: {
          ...state.config,
          viewAsList: newToggle
        }
      };
    }
    case "TOGGLE_SORT_BY": {
      let newToggle = !state.config.sortNewToOld;

      return {
        ...state,
        config: {
          ...state.config,
          sortNewToOld: newToggle
        }
      };
    }
    case "TOGGLE_SHOW_LOGIN_LOADER": {
      let newToggle = !state.config.showLoginLoader;

      return {
        ...state,
        config: {
          ...state.config,
          showLoginLoader: newToggle
        }
      };
    }
    case "TOGGLE_SHOW_HOME_LOADER": {
      let newToggle = !state.config.showHomeLoader;

      return {
        ...state,
        config: {
          ...state.config,
          showHomeLoader: newToggle
        }
      };
    }
    case "UPDATE_TODO_LIST": {
      let newTodos = action.payload.todos;
      let newColors = action.payload.colors;

      return {
        ...state,
        data: {
          ...state.data,
          todos: newTodos,
          colors: newColors
        }
      };
    }

    // AUTH
    case "SIGN_IN_SUCCESS_REDUCER": {
      localStorage.setItem("user", JSON.stringify(action.payload.credential));

      return {
        ...state,
        auth: {
          ...action.payload.user,
          error: null
        }
      };
    }
    case "SIGN_IN_FAILED": {
      return {
        ...state,
        auth: {
          ...state.auth,
          error: action.payload
        }
      };
    }
    case "SIGN_UP_SUCCESS_REDUCER": {
      localStorage.setItem("user", JSON.stringify(action.payload.credential));

      return {
        ...state,
        auth: {
          ...action.payload.user,
          error: null
        }
      };
    }
    case "SIGN_UP_FAILED": {
      return {
        ...state,
        auth: {
          ...state.auth,
          error: action.payload
        }
      };
    }
    case "SIGN_OUT_SUCCESS": {
      localStorage.removeItem("user");

      return {
        ...initState
      };
    }
    case "SIGN_OUT_FAILED": {
      return state;
    }
    case "CLEAR_AUTH_ERROR": {
      return {
        ...state,
        auth: {
          ...state.auth,
          error: null
        }
      };
    }

    default:
      return state;
  }
};
