import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from "moment"
import { getSearchResult, setSearchTerm } from '../store/hackerResults/actions'

function HackerSearch (props) {
    const [debounceTerm, setDebounceTerm] = useState(props.term)

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (props.term && props.term.length >= 3) {
                setDebounceTerm(props.term)
            }
        }, 1000)

        return () => {
            clearTimeout(timerId)
        }
    }, [props.term])

    useEffect(() => {

        if (debounceTerm) {
            props.getSearchResult(debounceTerm)
        }

    }, [debounceTerm])

    const renderResults = () => {
        if (props.results) {
            return props.results.map((result) => {

                if (result.title !== null && result.title !== '') {
                    return (
                        <div key={result.created_at_i} className="item">
                            <div className="content">
                                <div className="ui grid">
                                    <div style={{ margin: '10px 0'}} className="sixteen wide column">
                                        <a style={{ margin: '10px 0'}} className="header" href={result.url}>{result.title}</a>

                                        <div className="description">
                                            <strong>Points:</strong> <a href={`https://news.ycombinator.com/item?id=${result.objectID}`}>{result.points}</a> | 
                                            <strong> Author:</strong> <a href={`https://news.ycombinator.com/user?id=${result.author}`}>{result.author}</a> |
                                            <strong> Date Posted:</strong> {moment(result.created_at).utc().format('YYYY-MM-DD h:mm:ss a')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        } 
    }
    
    return (
        <div>
            <div className={`ui search ${props.loading ? 'loading' : ''}`}>
                <div className="ui icon input">
                    <input className="prompt" onChange={e => props.setSearchTerm(e.target.value)} value={props.term} placeholder="Enter Search Term..."/>
                    <i className="search icon"></i>
                </div>
            </div>

            {props.error ? <div className="header ui raised very padded segment">{props.error}</div> : ''}

            {props.results === undefined || props.results.length === 0 ?
                <div className="header ui raised very padded segment">No Results</div>
            :   <div style={{ paddingBottom: '80px'}} className="ui raised very padded celled list segment">{renderResults()}</div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.results.loading,
        results: state.results.results,
        term: state.results.searchTerm,
        error: state.results.error
    }
}

export default connect (mapStateToProps, { getSearchResult, setSearchTerm })(HackerSearch)