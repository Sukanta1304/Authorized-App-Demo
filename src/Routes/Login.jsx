import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const handlelogin = ({ email, password }) => {
  return axios({
    url: "https://reqres.in/api/login",
    method: "POST",
    data: {
      email,
      password
    }
  });
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, dispatch] = useContext(AppContext);
  const handlesubmit = (e) => {
    e.preventDefault();
    handlelogin({ email, password }).then((res) => {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: res.data.token
        }
      });
    });
  };
  if (state.isAuth) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <form data-testid="login-form" onSubmit={handlesubmit}>
        <div>
          <label>
            Email
            <input
              data-testid="email-input"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              data-testid="password-input"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <input data-testid="form-submit" type="submit" value="SUBMIT" />
        </div>
      </form>
      <div>
        <Link to="/">Go Back</Link>
      </div>
    </div>
  );
}
export default Login;
