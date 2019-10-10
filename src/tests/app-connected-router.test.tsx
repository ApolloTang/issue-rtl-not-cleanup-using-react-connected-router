import React from 'react'

import { render, fireEvent, cleanup, RenderResult } from '@testing-library/react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { ConnectedRouter } from 'connected-react-router'

import {App} from '../app'

let rendered1:RenderResult
let rendered2:RenderResult

describe('[Connected Router]', () => {
  beforeEach(()=>{ cleanup() })
  afterEach(()=>{ cleanup() })

  describe('Navigate to page a', () => {

    it('Connected Router Redux has path name /a', () => {

      const history = createBrowserHistory()
      const RootReducer = combineReducers( { router: connectRouter(history), })
      const store = createStore( RootReducer, {}, applyMiddleware(routerMiddleware(history), thunk))
      rendered1 = render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      )

      const {
        getByText, unmount
      } = rendered1

      const storeBeforeNavigate = store.getState()
      expect(storeBeforeNavigate.router.location.pathname).toBe('/')

      const link = getByText('Link to: /page a')
      fireEvent.click(link)

      const storeAfterNavigate = store.getState()
      expect(storeAfterNavigate.router.location.pathname).toBe('/a')
      unmount()
    })

    it('Connected Router Redux handle no match', () => {

      const history = createBrowserHistory()
      const RootReducer = combineReducers( { router: connectRouter(history), })
      const store = createStore( RootReducer, {}, applyMiddleware(routerMiddleware(history), thunk))

      rendered2 = render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      )

      const {
        queryByText,
        debug, container
      } = rendered2

      debug(container)  //<--- jestDom was not clear
      queryByText(/Link to: \/page a/i)

      const storeBeforeNavigate = store.getState()
      expect(storeBeforeNavigate.router.location.pathname).toBe('/')

    })

    it('different instance', ()=>{
      expect(rendered1).not.toEqual(rendered2)
    })
  })

})




