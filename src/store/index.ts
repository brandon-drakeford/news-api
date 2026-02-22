import { configureStore } from '@reduxjs/toolkit'
import hackerReducer from './hackerSlice'

export const store = configureStore({
  reducer: {
    results: hackerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
