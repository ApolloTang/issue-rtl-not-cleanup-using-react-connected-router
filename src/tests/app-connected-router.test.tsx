import React from 'react'

import { render, fireEvent, cleanup, RenderResult } from '@testing-library/react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createMemoryHistory as createHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { ConnectedRouter } from 'connected-react-router'

import {App} from '../app'


describe('[Connected Router]', () => {
  beforeEach(()=>{ cleanup() }) // <------ cleanup not working ?
  afterEach(()=>{ cleanup() }) // <------- cleanup not working ?

  describe('Navigate to page a', () => {

    it('Connected Router Redux show navigate to page a', () => {
      const history = createHistory()
      const RootReducer = combineReducers( { router: connectRouter(history), })
      const store = createStore( RootReducer, {}, applyMiddleware(routerMiddleware(history), thunk))
      const rendered:RenderResult = render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      )

      const {
        getByText, unmount
      } = rendered

      const storeBeforeNavigate = store.getState()
      expect(storeBeforeNavigate.router.location.pathname).toBe('/')

      const link = getByText('Link to: /page a')
      fireEvent.click(link)

      const storeAfterNavigate = store.getState()
      expect(storeAfterNavigate.router.location.pathname).toBe('/a')

      unmount() // <-- unmount() not working ????
    })

    it('This test should fail if using createBrowserHistory, but pass if useing createMemoryHistory', () => {
      const history = createHistory()
      const RootReducer = combineReducers( { router: connectRouter(history), })
      const store = createStore( RootReducer, {}, applyMiddleware(routerMiddleware(history), thunk))

      const rendered:RenderResult = render(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      )

      const {
        queryByText,
        debug, container
      } = rendered

      debug(container)                  //<--- show that jsDom was not clear: showing 'Page content a', ok w createMemoryHistory
      const pageContentA = queryByText('Page content a')
      expect(pageContentA).toBeNull()  // <-------- Fail, but pass w crearteMemoryHistory !!!

      const storeBeforeNavigate = store.getState()
      expect(storeBeforeNavigate.router.location.pathname).toBe('/')  //<------- Fail, but pass w createMemoryHistory!!!

    })
  })

})




