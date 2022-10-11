import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/clientAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});

    useEffect(() => {
        const authUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
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

                } catch (err) {

                }
            }
        }
        authUser()
    }, [])


    return (
        <AuthContext.Provider value={{ setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext