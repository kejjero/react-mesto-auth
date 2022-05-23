import React from "react";
import logo from "../images/header__logo.svg"
import {Link} from "react-router-dom";

function Header(isLoggedIn) {

    const handleValue = isLoggedIn ? 'Регистрация' : 'Войти'
    const handleLink = isLoggedIn ? '/sign-up' : '/sign-in'

    return (
        <header className='header'>
            <Link to={'/'} className='header__logo' src={logo} alt='Логотип'/>
            <Link to={handleLink} className='header__enter' >{handleValue}</Link>
        </header>
    )
}

export default Header;