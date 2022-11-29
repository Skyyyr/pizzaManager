import CredentialsForm from "../Components/CredentialsForm.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Signup() {
  const nav = useNavigate()

  async function handleSignup() {
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;

    // Does the email follow the correct format
    if (!userEmail.includes('@')) {
      console.log("Email didn't include an @\n" + userEmail);
      return;
    }

    // Is the PW long enough
    if (userPassword.length <= 7) {
      console.log("Password is not long enough");
      return;
    }

    const signupResp = await axios.post('/signup', {email: userEmail, password: userPassword})
      .catch((e) => {
        console.log("Error caught at: " + e);
      });

    const results = signupResp.data['signup'];
    if (results === 'success') {
      alert("You've successfully created your account");
      nav('/login');
      // Should probably auto log in
    } else {
      alert("The email or password you've entered is not valid to create an account. " +
        "Ensure your email is correct, and your password is 8 digits or more.");
    }
  }

  return (
    <div>
      <CredentialsForm
          title={'Pizza Manager Signup'}
          description={'Provide an e-mail and a password to create an account for free.'}
          btnSubmit={'Signup'}
          clickFunc={handleSignup}
        />
    </div>
  )
}

export default Signup