import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { HackerResult } from '../types/hacker'

interface HackerState {
  loading: boolean
  searchTerm: string
  results: HackerResult[]
  error: string | null
}

const initialState: HackerState = {
  loading: false,
  searchTerm: 'ransomware',
  results: [],
  error: null,
}

export const fetchSearchResults = createAsyncThunk<
  HackerResult[],
  string,
  { rejectValue: string }
>('hacker/search', async (searchTerm, { rejectWithValue }) => {
  try {
    // Use URLSearchParams to properly encode the query and prevent injection
    const params = new URLSearchParams({ query: searchTerm })
    const response = await axios.get<{ hits: HackerResult[] }>(
      `https://hn.algolia.com/api/v1/search?${params.toString()}`
    )
    return response.data.hits
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
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true
        state.results = []
        state.error = null
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unknown error'
      })
  },
})

export const { setSearchTerm } = hackerSlice.actions
export default hackerSlice.reducer
