import R from 'ramda'
import {createStore, applyMiddleware, compose} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './RootReducer'
import rootSaga from '../Sagas'
import Reactotron from 'reactotron-react-js'
import createTrackingEnhancer from 'reactotron-redux'

// the logger master switch
const USE_LOGGING = true

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED']

// create the logger
const logger = createLogger({
  predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST))
})

// a function which can create our store and auto-persist the data
export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const tracker = createTrackingEnhancer(Reactotron, {
  })
  const enhancers = compose(
    applyMiddleware(logger, sagaMiddleware),
    tracker
  )

  const store = createStore(rootReducer, enhancers)
  sagaMiddleware.run(rootSaga)
  return store
}