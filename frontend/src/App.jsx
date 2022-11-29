import {useEffect, useState} from 'react'
import './App.css'
import axios from 'axios'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {HashRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Login from "./Pages/Login.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import Home from "./Pages/Home.jsx";
import Signup from "./Pages/Signup.jsx";
import Logout from "./Pages/Logout.jsx";
import {Container} from "react-bootstrap";
import Toppings from "./Pages/Toppings.jsx";
import Pizzas from "./Pages/Pizzas.jsx";
import NewTopping from "./Pages/NewTopping.jsx";
import NewPizza from "./Pages/NewPizza.jsx";
import UpdatePizza from "./Components/UpdatePizza.jsx";

// Create Cookie for session
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


const csrfToken = getCookie('csrftoken');
axios.defaults.headers.common['X-CSRFToken'] = csrfToken;


function App() {
  const [user, setUser] = useState()
  
  async function whoAmI() {
    const resp = await axios.get('/whoami');
    const usr = resp?.data[0]?.fields;

    setUser(usr);
  }


  useEffect(() => {
        whoAmI().catch((e) => {
          console.log("Encountered an error with whoAmI with error: " + e);
        });
    }, [])

  return (
    <div className="App">

      <Navbar
        className={'navbar'}
        expand={'lg'}
      >
        <Container>

          <Navbar.Brand href={'/'}>
            Pizza Manager
          </Navbar.Brand>

          <Nav className={'me-auto'}>
            {user ?
              <>
                <Nav.Link href={'/#/logout'}>
                  Logout
                </Nav.Link>

                <Nav.Link href={'/#/toppings'}>
                  Toppings
                </Nav.Link>

                <Nav.Link href={'/#/pizzas'}>
                  Pizzas
                </Nav.Link>
              </>
              :
              <>
                <Nav.Link href={'/#/signup'}>
                  Sign Up
                </Nav.Link>

                <Nav.Link href={'/#/login'}>
                  Login
                </Nav.Link>
              </>
            }

          </Nav>
        </Container>
      </Navbar>

      <Router>
        <Routes>

          <Route
            exact path={'/'}
            element={<Home/>}
          />

          <Route
            exact path={'/signup'}
            element={<Signup/>}
          />

          <Route
            exact path={'/login'}
            element={<Login/>}
          />

          <Route
            exact path={'/logout'}
            element={<Logout loggedUser={user} whoAmI={whoAmI}/>}
          />

          <Route
            exact path={'/toppings'}
            element={<Toppings/>}
          />

          <Route
            exact path={'/toppings/new'}
            element={<NewTopping/>}
          />

          <Route
            exact path={'/pizzas'}
            element={<Pizzas/>}
          />

          <Route
            exact path={'/pizzas/new'}
            element={<NewPizza/>}
          />

          <Route
            exact path={'*'}
            element={<PageNotFound/>}
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App
