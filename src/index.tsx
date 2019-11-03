import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Imports
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers/rootReducer';

import "bootstrap/dist/css/bootstrap.min.css";

import createSagaMiddleware from "redux-saga";
import { watchMiddleware } from './sagas/saga';

export const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(watchMiddleware, store.dispatch, store.getState);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
