import { applyMiddleware, combineReducers, createStore } from "redux"
import reduxThunk from "redux-thunk"
import { SongsReducer } from "./reducers/SongsReducer"

const rootReducer = combineReducers({
    SongsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(reduxThunk))