import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/authReducers'
import { podcastsReducer } from './reducers/podcastsReducers'
import { businessReducer } from './reducers/businessReducers'
import { courseReducer } from './reducers/courseReducer'
import { subscriptionReducer } from './reducers/subscriptionReducers'

const store = configureStore({
    reducer: {
        auth: authReducer,
        podcasts: podcastsReducer,
        business: businessReducer,
        course: courseReducer,
        subscription: subscriptionReducer
    },
})

export default store