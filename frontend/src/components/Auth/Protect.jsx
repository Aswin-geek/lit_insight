import { Outlet, Navigate } from "react-router-dom";
import PropTypes from "prop-types"

export default function Protect({ role }) {
    const type = localStorage.getItem("type")
    const user = JSON.parse(type)
    const isAuth = user && user === role
    console.log(isAuth)

    return<>{isAuth ? <Outlet />: <Navigate to="/" />}</>
}

Protect.propTypes = {
    role: PropTypes.string.isRequired,
}