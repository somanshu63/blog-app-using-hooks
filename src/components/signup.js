import React, { useState } from "react";
import { NavLink, withRouter } from "react-router-dom";
import baseurl from "../utils/constants";
import validate from "../utils/validate";
import Loading from "./loading";

function Signup(props) {
  // constructor() {
  //   super();
  //   this.state = {
  //     username: null,
  //     email: null,
  //     password: null,
  //     loading: false,
  //     errors: {
  //       username: null,
  //       email: null,
  //       password: null,
  //     },
  //   };
  // }
  let errorsObj = {
    username: null,
    email: null,
    password: null,
  };
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(errorsObj);

  let handleInput = ({ target }) => {
    let { name, value } = target;
    validate(errors, name, value);
    // this.setState({
    //   errors,
    //   [name]: value,
    // });
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "errors") {
      setErrors(value);
    }
  };
  let checkInput = () => {
    if (!username || !password || !email) {
      // this.setState({
      //   errors: {
      //     email: "required email/password/username",
      //   },
      // });
      errorsObj.email = "required email/password/username";
      // setErrors(errorsObj);
    }
  };
  let signUp = () => {
    fetch(`${baseurl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: `${username}`,
          email: `${email}`,
          password: `${password}`,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((user) => {
        localStorage.setItem("userToken", JSON.stringify(user.user.token));
        props.handleLogIn(user.user);
        props.history.push("/");
      })
      .catch((errors) => {
        // this.setState({ errors, loading: false });
        setErrors(errors);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="login flex-col p-12 flex justify-center items-center">
          <h2 className="text-2xl p-2 blue">Sign up</h2>
          <div className="flex flex-row">
            <p className="text-green-500 text-lg">Already have an account?</p>
            <NavLink
              to="/login"
              className={"text-blue-900 text-xl underline px-2"}
            >
              Login
            </NavLink>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              checkInput();
              // setState({
              //   loading: true,
              // });
              setLoading(true);
              signUp();
            }}
          >
            <span className="text-xs text-red-500">{errors.email}</span>
            <input
              placeholder="Enter Email"
              onChange={handleInput}
              className="text-xl rounded-md w-70 py-1 px-4 my-2 border-2 border-solid border-blue-900 text-blue-900"
              type="text"
              name="email"
              value={email}
            ></input>
            <span className="text-xs text-red-500">{errors.password}</span>
            <input
              placeholder="Enter Password"
              onChange={handleInput}
              type="password"
              name="password"
              value={password}
              className="text-lg rounded-md w-70 py-1 px-4 my-2 border-2 border-solid border-blue-900 text-blue-900"
            ></input>
            <span className="text-xs text-red-500">{errors.username}</span>
            <input
              placeholder="Enter Username"
              onChange={handleInput}
              className="text-lg rounded-md w-70 py-1 px-4 my-2 border-2 border-solid border-blue-900 text-blue-900"
              type="text"
              name="username"
              value={username}
            ></input>
            <input
              className={` text-lg cursor-pointer rounded-md w-70 py-1 px-4 my-2 border-2 border-solid  ${
                !email || !password || !username
                  ? "border-red-500 text-red-500 bg-red-200"
                  : "border-green-700 text-green-700 bg-green-200"
              }`}
              type="submit"
              value="Sign up"
              disabled={errors.email || errors.password || errors.username}
            ></input>
          </form>
        </div>
      )}
    </>
  );
}
export default withRouter(Signup);
