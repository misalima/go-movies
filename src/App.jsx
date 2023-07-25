import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from './components/Alert';

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassname, setAlertClassName] = useState("d-none");
  const navigate = useNavigate();

  const [tickInterval, setTickInterval] = useState();

  function logOut() {
    const requestOptions = {
      method: "GET",
      credentials: "include"
    }

    fetch(`http://localhost:8080/logout`, requestOptions)
      .catch(error => {
        console.log("error loggint out", error);
      })
      .finally(() => {
        setJwtToken("");
        toggleRefresh(false);
      })

    
    navigate("/login");
  }
  const toggleRefresh = useCallback((status) => {
    if(status) {
      let i = setInterval(() => {
        const requestOptions = {
          methor: "GET",
          credentials: "include",
        }
        fetch(`http://localhost:8080/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error)
        })
      }, 600000);
      setTickInterval(i);
    }else {
      clearInterval(tickInterval);
      setTickInterval(null);
    }

  }, [tickInterval]);

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        methor: "GET",
        credentials: "include",
      }

      fetch(`http://localhost:8080/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error)
        })
    }
  }, [jwtToken, toggleRefresh]);

  

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Hello, World!</h1>
        </div>
        <div className="col text-end">
          {jwtToken === ""
            ?<Link to="/login"><span className="badge bg-success">Login</span></Link>
            :<Link onClick={logOut} to="/login"><span className="badge bg-secondary">Logout</span></Link>
          }
        </div>
        <hr className="mb-3" />
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">Home</Link>
              <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
              <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
              {jwtToken !== "" &&
              <>
              <Link to="/admin/movie/0" className="list-group-item list-group-item-action">Add Movie</Link>
              <Link to="/manage-catalogue" className="list-group-item list-group-item-action">Manage Catalogue</Link>
              <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
              </>
              }
            </div>
          </nav>
        </div>

        <div className="col-md-10">
          <Alert
            message={alertMessage}
            className={alertClassname}
          />
          <Outlet context={{
            jwtToken, setJwtToken, setAlertClassName, setAlertMessage, toggleRefresh
          }}/>
        </div>
      </div>
    </div>
  );
}

export default App;
