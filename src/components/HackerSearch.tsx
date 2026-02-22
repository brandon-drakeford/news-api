import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchSearchResults, setSearchTerm } from '../store/hackerSlice'
import type { HackerResult } from '../types/hacker'

// Only allow http/https URLs to prevent javascript: and other protocol attacks
const isSafeUrl = (url: string | null | undefined): url is string => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

// Replaces moment.js — formats UTC date as "YYYY-MM-DD h:mm:ss am/pm"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = date.getUTCHours()
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  return `${year}-${month}-${day} ${displayHours}:${minutes}:${seconds} ${ampm}`
}

export default function HackerSearch() {
  const dispatch = useAppDispatch()
  const { loading, results, searchTerm: term, error } = useAppSelector(
    (state) => state.results
  )
  const [debounceTerm, setDebounceTerm] = useState(term)

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (term && term.length >= 3) {
        setDebounceTerm(term)
      }
    }, 1000)
    return () => clearTimeout(timerId)
  }, [term])

  useEffect(() => {
    if (debounceTerm) {
      dispatch(fetchSearchResults(debounceTerm))
    }
  }, [debounceTerm, dispatch])

  const renderResults = () => {
    return results
      .filter((result): result is HackerResult & { title: string } =>
        Boolean(result.title)
      )
      .map((result) => (
        <div key={result.created_at_i} className="item">
          <div className="content">
            <div className="ui grid">
              <div style={{ margin: '10px 0' }} className="sixteen wide column">
                {isSafeUrl(result.url) ? (
                  <a
                    style={{ margin: '10px 0' }}
                    className="header"
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </a>
                ) : (
                  <span style={{ margin: '10px 0' }} className="header">
                    {result.title}
                  </span>
                )}
                <div className="description">
                  <strong>Points:</strong>{' '}
                  <a
                    href={`https://news.ycombinator.com/item?id=${encodeURIComponent(result.objectID)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.points}
                  </a>{' '}
                  |{' '}
                  <strong>Author:</strong>{' '}
                  <a
                    href={`https://news.ycombinator.com/user?id=${encodeURIComponent(result.author)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.author}
                  </a>{' '}
                  | <strong>Date Posted:</strong> {formatDate(result.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
  }

  return (
    <div>
      <div className={`ui search ${loading ? 'loading' : ''}`}>
        <div className="ui icon input">
          <input
            className="prompt"
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            value={term}
            placeholder="Enter Search Term..."
          />
          <i className="search icon"></i>
        </div>
      </div>

      {error && (
        <div className="header ui raised very padded segment">{error}</div>
      )}

      {results.length === 0 ? (
        <div className="header ui raised very padded segment">No Results</div>
      ) : (
        <div
          style={{ paddingBottom: '80px' }}
          className="ui raised very padded celled list segment"
        >
          {renderResults()}
        </div>
      )}
    </div>
  )
}
