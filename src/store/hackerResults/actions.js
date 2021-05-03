import axios from 'axios'
import { actionSearch } from './types'

export function getSearchResult (searchTerm) {
    return function getSearchResult(dispatch){
        dispatch({ type: actionSearch.INIATE_SEARCH_REQUEST })
        
        axios.get(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
            .then(result => {
                dispatch({ type: actionSearch.INIATE_SEARCH_SUCCESS, payload: result.data.hits })
            })
            .catch(error => {
                dispatch({ type: actionSearch.INIATE_SEARCH_FAILURE, error })
            })
    }
}

export function setSearchTerm (searchTerm) {
    return function setSearchTerm (dispatch) {
        dispatch({ type: actionSearch.SAVE_SEARCH_RESULT, payload: searchTerm })
    }
}