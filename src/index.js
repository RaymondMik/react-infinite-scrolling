import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import App from "./components/App";
import users from "./store/reducers";
import fetchUsersSaga from "./store/sagas";

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const rootReducer = combineReducers({ users });
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(sagaMiddleware, loggerMiddleware)
));

sagaMiddleware.run(fetchUsersSaga);

/**
 * Render React application
 */
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
