import CredentialsForm from "../Components/CredentialsForm.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Login() {
  const nav = useNavigate()

  async function handleLogin() {
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;

    const loginResp = await axios.post('/login', {email: userEmail, password: userPassword})
      .catch((e) => {
        console.log("Caught an error at login " + e)
      });

    const results = loginResp.data['login'];

    if (results === 'success') {
      nav('/');
      window.location.reload();
    } else {
      alert("The user name or password that you entered were incorrect.");
    }
  }

  return (
    <div>
        <CredentialsForm
          title={'Pizza Manager Login'}
          description={'If you have an account, login in with your credentials below.'}
          btnSubmit={'Login'}
          clickFunc={handleLogin}
        />
    </div>
  )
}

export default Login