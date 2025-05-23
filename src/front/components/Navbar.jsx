import { Link } from "react-router-dom";
import { useContext} from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { isLogged, setIsLogged } = useGlobalReducer();
	if (!isLogged){
			return (
				<nav className="navbar navbar-light bg-light">
					<div className="container">
						<Link to="/">
							<span className="navbar-brand mb-0 h1">JWT- FLASK- REACT Project</span>
						</Link>
						<div className="d-inline-flex ml-auto">
							<div className="me-2">
								<Link to="/login">
									<button className="btn btn-light">Login</button>
								</Link>
							</div>
							<div className="ms-2 ml-auto">
								<Link to="/signup">
									<button className="btn btn-primary">Sign-up</button>
								</Link>
							</div>
						</div>
					</div>
				</nav>
			);
		}else {
			return (
				<nav className="navbar navbar-light bg-light">
					<div className="container">
						<Link to="/">
							<span className="navbar-brand mb-0 h1">JWT- FLASK- REACT Project</span>
						</Link>
						<div className="d-inline-flex ml-auto">
							<div className="me-2">
								<Link to="/logout">
									<button className="btn btn-light">Log-out</button>
								</Link>
							</div>
						</div>
					</div>
				</nav>
			);
		}
};