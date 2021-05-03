import React from 'react'
import Header from './components/Header'
import HackerSearch from './components/HackerSearch'
import Footer from './components/Footer'

export default function App () {
    return (
        <div>
            <Header />
            <div className="ui vertical">
                <div className="ui container">
                    <HackerSearch />
                </div>
            </div>

            <Footer />
        </div>
    )
}

