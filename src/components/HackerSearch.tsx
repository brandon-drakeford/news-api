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

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const formatRelativeTime = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`
}

export default function HackerSearch() {
  const dispatch = useAppDispatch()
  const { loading, results, searchTerm: term, error, page, nbPages, nbHits } = useAppSelector(
    (state) => state.results
  )
  const [debounceTerm, setDebounceTerm] = useState(term)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (term && term.length >= 3) {
        setDebounceTerm(term)
        setHasSearched(true)
      }
    }, 1000)
    return () => clearTimeout(timerId)
  }, [term])

  useEffect(() => {
    if (debounceTerm) {
      dispatch(fetchSearchResults({ searchTerm: debounceTerm, page: 0 }))
    }
  }, [debounceTerm, dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(fetchSearchResults({ searchTerm: term, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderCards = () => {
    return results
      .filter((result): result is HackerResult & { title: string } =>
        Boolean(result.title)
      )
      .map((result) => (
        <div key={result.objectID} className="ui fluid card" style={{ marginBottom: '12px' }}>
          <div className="content">
            <div className="header" style={{ fontSize: '1rem', marginBottom: '6px' }}>
              {isSafeUrl(result.url) ? (
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              ) : (
                <span>{result.title}</span>
              )}
            </div>
            <div className="meta" style={{ marginTop: '6px' }}>
              {formatRelativeTime(result.created_at)}
            </div>
            <div className="description" style={{ marginTop: '6px' }}>
              by{' '}
              <a
                href={`https://news.ycombinator.com/user?id=${encodeURIComponent(result.author)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.author}
              </a>
            </div>
          </div>
          <div className="extra content">
            <a
              href={`https://news.ycombinator.com/item?id=${encodeURIComponent(result.objectID)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="comment outline icon"></i>
              {result.num_comments ?? 0} comments
            </a>
            <span className="right floated">
              <i className="arrow up icon"></i>
              {result.points ?? 0} points
            </span>
          </div>
        </div>
      ))
  }

  const showMinCharHint = term.length > 0 && term.length < 3
  const showNoResults = hasSearched && !loading && !error && results.length === 0

  return (
    <div style={{ paddingTop: '20px' }}>
      <div className={`ui search ${loading ? 'loading' : ''}`} style={{ width: '100%', marginBottom: '16px' }}>
        <div className="ui fluid icon input">
          <input
            className="prompt"
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            value={term}
            placeholder="Enter Search Term..."
          />
          <i className="search icon"></i>
        </div>
      </div>

      {showMinCharHint && (
        <div className="ui info message">
          <i className="info circle icon"></i>
          Enter at least 3 characters to search.
        </div>
      )}

      {error && (
        <div className="ui negative message">
          <i className="exclamation triangle icon"></i>
          {error}
        </div>
      )}

      {showNoResults && (
        <div className="ui warning message">
          No results found for &ldquo;{term}&rdquo;.
        </div>
      )}

      {!error && hasSearched && !loading && results.length > 0 && (
        <>
          <div className="ui secondary segment" style={{ marginBottom: '12px' }}>
            <strong>{nbHits.toLocaleString()}</strong> results for &ldquo;{term}&rdquo;
          </div>

          <div style={{ paddingBottom: nbPages > 1 ? '16px' : '80px' }}>
            {renderCards()}
          </div>

          {nbPages > 1 && (
            <div className="ui center aligned segment" style={{ paddingBottom: '80px' }}>
              <div className="ui pagination menu">
                <a
                  className={`item ${page === 0 ? 'disabled' : ''}`}
                  onClick={() => page > 0 && handlePageChange(page - 1)}
                >
                  <i className="chevron left icon"></i> Previous
                </a>
                <div className="item">
                  Page {page + 1} of {nbPages}
                </div>
                <a
                  className={`item ${page >= nbPages - 1 ? 'disabled' : ''}`}
                  onClick={() => page < nbPages - 1 && handlePageChange(page + 1)}
                >
                  Next <i className="chevron right icon"></i>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
