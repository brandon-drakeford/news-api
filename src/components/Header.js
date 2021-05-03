import React from 'react'

export default function Header () {

    return (
        <div style={{borderRadius: '0'}} className="ui inverted pointing top segment menu">
            <div className="ui container">
                <div className="ui secondary pointing menu">
                    <a style={{ color: '#fff' }} href="/" className="item"> 
                        <img style={{paddingRight: '10px'}} src="logo192.png" alt="React Header"/> 
                        Hacker Network Search
                    </a>
                </div>
            </div>
        </div>
    )
}
