import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
        <nav className='header'>
            <Link to="/" className='home-link'>
                MB.Converter
            </Link>
        </nav>
    </div>
  )
}

export default Header