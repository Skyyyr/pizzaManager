import {useNavigate} from "react-router-dom";
import axios from "axios";

function Logout({loggedUser, whoAmI}) {
  const nav = useNavigate()

  function handleLogout() {
    nav('/');
    axios.post('/logout')
      .then(() => {
        whoAmI();
      });
  }

  function handleCancel() {
    nav('/');
  }

  return (
    <div>
      <h1>
        Pizza Manager Logout
      </h1>
      <p>
        Are you sure you want to logout?
      </p>

      <hr/>

      <button
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  )
}

export default Logout