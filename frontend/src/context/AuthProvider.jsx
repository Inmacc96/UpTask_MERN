import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom"
import clientAxios from "../config/clientAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const authUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            else {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                try {
                    const { data } = await clientAxios("/users/profile", config)
                    setAuth(data);
                    /*  navigate("/projects") */

                } catch (err) {
                    setAuth({})
                } finally {
                    setLoading(false)
                }
            }
        }
        authUser()
    }, [])

    const logOutAuth = () => {
        setAuth({})
    }


    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, logOutAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext