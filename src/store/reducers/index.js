import { combineReducers } from 'redux'
import hackerSearchResults from '../hackerResults/reducers'

export default combineReducers ({
    results: hackerSearchResults
})