import React from 'react'

const footer = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%' 
}

const Footer = () => {
    return (
        <div style={footer} className="ui inverted vertical segment">
            <div className="ui container">
                <a className="ui secondary button" href="https://github.com/brandon-drakeford" target="_blank" rel="noreferrer">
                    <i className="github icon"></i> Github Portfolio
                </a>
            </div>
        </div>
    )
}

export default Footer