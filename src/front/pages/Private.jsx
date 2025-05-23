import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useContext} from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Private = () => {

    const { isLogged, setIsLogged } = useGlobalReducer();
    const [hidden_msg, setHiddenMsg] = useState("")
    
    
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");

        if (token) {
            setIsLogged(true);
            getPrivate();
        } else {
            setIsLogged(false);
        }
    }, []);

    if (isLogged) {
            return (
                <div className="container">
                    <h1> Menu privado</h1>
                    <div className="list-group">
                        <button type="button" className="list-group-item list-group-item-action active" aria-current="true">Menu Privado 1</button>
                        <button type="button" className="list-group-item list-group-item-action">Menu Privado 2</button>
                        <button type="button" className="list-group-item list-group-item-action">Menu Privado 3</button>
                        <button type="button" className="list-group-item list-group-item-action">Menu Privado 4</button>
                        <button type="button" className="list-group-item list-group-item-action" >Menu Privado 5</button>
                    </div>
                    <div>
                        <h3>The secret message from back end is ... (TBC) I get a 422 error when doing a GET with token {hidden_msg}</h3>
                    </div>
                </div>
            );
        }
    else{
        return(
            <div className= "container">
                <h1>Access forbidden!!!</h1>
            </div>
        )
    }
    

    async function getPrivate() {
        // Recupera el token desde la localStorage
        const token = localStorage.getItem('jwt-token');
        console.log("Saved token:", localStorage.getItem("jwt-token"));
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

        const resp = await fetch(backendUrl + '/api/private', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
            }
        });
        const data = await resp.json();
        if (!resp.ok) {
            if (resp.status === 403) {
                throw Error("Missing or invalid token");
            } else {
                throw Error("There was a problem in the login request");
            }
        }

        
        if (resp.ok){
            console.log("This is the data you requested", data);
            setHiddenMsg(data.message);
            return data;
        }
    }
}
