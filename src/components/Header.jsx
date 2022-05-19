import React from "react";
import logo from "../images/header__logo.svg"

function Header() {
    return (
        <header className="header">
            <img className={"header__logo"} src={logo} alt="Логотип"/>
        </header>
    )
}

export default Header;