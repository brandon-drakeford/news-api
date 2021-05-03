import { actionSearch } from './types'

const INITIAL_STATE = {
    loading: false,
    searchTerm: 'ransomware',
    results: [],
    tags: null,
    error: null
}

export default function hackerSearchResults(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionSearch.INIATE_SEARCH_REQUEST:
            return { loading: true, results: [] }
        case actionSearch.INIATE_SEARCH_SUCCESS:
            return { loading: false, results: action.payload }
        case actionSearch.INIATE_SEARCH_ERROR:
            return { loading: false, error: action.error }
        case actionSearch.SAVE_SEARCH_RESULT:
            return { searchTerm: action.payload }
        default:
            return state
    }
}