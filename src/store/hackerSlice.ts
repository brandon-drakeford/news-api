import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { HackerResult } from '../types/hacker'

interface HackerState {
  loading: boolean
  searchTerm: string
  results: HackerResult[]
  error: string | null
  page: number
  nbPages: number
  nbHits: number
}

const initialState: HackerState = {
  loading: false,
  searchTerm: 'ransomware',
  results: [],
  error: null,
  page: 0,
  nbPages: 0,
  nbHits: 0,
}

interface FetchArgs {
  searchTerm: string
  page: number
}

interface FetchResult {
  hits: HackerResult[]
  nbPages: number
  nbHits: number
}

export const fetchSearchResults = createAsyncThunk<
  FetchResult,
  FetchArgs,
  { rejectValue: string }
>('hacker/search', async ({ searchTerm, page }, { rejectWithValue }) => {
  try {
    // Use URLSearchParams to properly encode the query and prevent injection
    const params = new URLSearchParams({ query: searchTerm, page: String(page) })
    const response = await axios.get<{ hits: HackerResult[]; nbPages: number; nbHits: number }>(
      `https://hn.algolia.com/api/v1/search?${params.toString()}`
    )
    return {
      hits: response.data.hits,
      nbPages: response.data.nbPages,
      nbHits: response.data.nbHits,
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.message)
    }
    return rejectWithValue('An unexpected error occurred')
  }
})

const hackerSlice = createSlice({
  name: 'hacker',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        state.loading = true
        state.results = []
        state.error = null
        state.page = action.meta.arg.page
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.hits
        state.nbPages = action.payload.nbPages
        state.nbHits = action.payload.nbHits
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unknown error'
      })
  },
})

export const { setSearchTerm } = hackerSlice.actions
export default hackerSlice.reducer
