
const randomCardColor = () => {
    let colors = [
      "secondary",
      "primary",
      "success",
      "danger",
      "warning",
      "info",
      "dark"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

export const removeTodoById = (id: string) => {
    return { type: "REMOVE_TODO_BY_ID", payload: { id } };
}

export const updateTodoByIdAction = (id: string, title: string, body: string, finished: boolean) => {
    return { type: "UPDATE_TODO_BY_ID", payload: { id, title, body, finished } }
}

export const addTodoAction = (title: string, body: string, userId: string) => {
    return { type: "ADD_TODO", payload: {title, body, userId} }
}

export const syncTodoAction = (data: any) => {

    let snapshots = data.docs;
    let todos = [];
    for (let i in snapshots) {

        let data = snapshots[i].data();
        data["pathId"] = snapshots[i].id;

        todos.push(data);
    }

    let colors: any = [];
    for (let i = 0; i < todos.length; i++) {
        colors.push(randomCardColor());
    }

    return { type: "UPDATE_TODO_LIST", payload: { todos, colors } };
}

export const toggleAddTodoComponentAction = () => {
    return { type: "TOGGLE_ADDTODO_COMPONENT" };
}

export const toggleTodoViewAction = () => {
    return { type: "TOGGLE_TODO_VIEW" };
}

export const toggleSortByAction = () => {
    return { type: "TOGGLE_SORT_BY" };
}

export const updateSortedTodosAction = (todos: any) => {
    return { type: "UPDATE_SORTED_TODOS", payload: { todos } };
}