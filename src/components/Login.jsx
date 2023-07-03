import { useState } from "react";
import Input from "./form/Input";
import { useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setJwtToken } = useOutletContext();
    const { setAlertClassName } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === "admin@example.com") {
            setJwtToken("abc");
            console.log("email/pass", email, password);
            setAlertClassName("d-none");
            setAlertMessage("");
            navigate("/");
        } else {
            setAlertClassName("alert-danger");
            setAlertMessage("Invalid email/password.");
        }
    }
    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />
            
            <form onSubmit={handleSubmit}>
                <Input 
                    title="Email Adress"
                    name="email"
                    type="email"
                    className="form-control"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Input 
                    title="Password"
                    name="password"
                    type="password"
                    className="form-control"
                    autoComplete="password-new"
                    onChange={(event) => setPassword(event.target.value)}
                />

                <hr />

                <input 
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                 />
            </form>
        </div>
    );
}

export default Login;