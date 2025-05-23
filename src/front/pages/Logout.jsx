import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext} from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Logout = () => {
    const { isLogged, setIsLogged } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.removeItem("jwt-token")
        setIsLogged(false);
        const timer = setTimeout(() => {
            navigate("/"); 
        }, 2000);

        return () => clearTimeout(timer);
    } ,[]);
    
    
    return(
        <div className ="container">
            <h1>You are logged out now!</h1>
        </div>
    )
}