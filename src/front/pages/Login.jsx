import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext} from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {

    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { isLogged, setIsLogged } = useGlobalReducer();
    let navigate  =useNavigate();

    const contact = {
        email: email,
        password: pass
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")
            const resp = await fetch(backendUrl+ "/api/token", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact) 
            })

            if(!resp.ok) {
                setErrorMessage("wrong user or password");
                console.log(errorMessage)
                throw Error("There was a problem in the login request");
            }
            if(resp.status === 401){
                throw("Invalid credentials")
            }
            else if(resp.status === 400){
                throw ("Invalid email or password format")
            }
            const data = await resp.json()
            // Guarda el token en la localStorage
            // También deberías almacenar el usuario en la store utilizando la función setItem
            localStorage.setItem("jwt-token", data.token);
            setIsLogged(true);
            navigate("/private");
            return data;
        }
        catch (error){
            console.log(error);
            setErrorMessage("Login unsuccesful");
        }
        
    }


     return (
        <div>
            <div className = "container">
                <h2>Please log-in:</h2>
            </div>
            <form className = "container border rounded mt-2 p-3" onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Your email" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <p className= "text-danger">{errorMessage != "" ? errorMessage : ""}</p>
            </form>
        </div>
     )


    
}