import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Signup = () => {

    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");
    const [sucessRegister, setSuccesRegister] = useState(false);


    const contact = {
        email: email,
        password: pass
    };

    useEffect(() => setSuccesRegister(false), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

        const response = await fetch(backendUrl + "/api/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contact)
            })
        const data = await response.json()

        if (response.ok) {
            console.log(data);
            setSuccesRegister(true);
        }
        else {
            console.log('error: ', response.status, response.statusText);
            /* Realiza el tratamiento del error que devolvió el request HTTP */
            return { error: { status: response.status, statusText: response.statusText } };
        }
    }

    if (sucessRegister == false) {
        return (
            <div>
                <div className = "container">
                    <h2>Please input credentials to register: </h2>
                </div>
                <form className = "container border rounded mt-2 p-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Your email" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    } else {
        return (
            <div className= "container">
                <h1>You are registered now!</h1>
                <h1>Please proceed to login....</h1>
            </div>
        )
    }

    
}
