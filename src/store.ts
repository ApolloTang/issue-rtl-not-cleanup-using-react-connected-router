import {
  createStore,
  combineReducers, applyMiddleware, compose
} from 'redux'
import thunk from 'redux-thunk'

import { createBrowserHistory } from 'history'
const history = createBrowserHistory()

import { connectRouter, routerMiddleware } from 'connected-react-router'


// RootReducer
const RootReducer = combineReducers( {
  router: connectRouter(history),
  foo: (s={})=>s
})


// Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  RootReducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history), thunk)
  )
)


export {
  store, history,
  RootReducer
}
