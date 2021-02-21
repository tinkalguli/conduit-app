import { Component } from "react";
import { Link } from "react-router-dom";
import { registerURL } from "./utility/utility";
import { withRouter } from "react-router-dom";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    errors: {
      username: "",
      email: "",
      password: "",
    },
    requestError: "",
    validationError: "",
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const user = { username, email, password };
    const errors = this.state.errors;

    if (!errors.username && !errors.email && !errors.password) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      };

      fetch(registerURL, requestOptions)
        .then((res) => {
          if (res.status !== 422 && !res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          if (data.errors) {
            const error = data.errors.body[0];

            this.setState({
              validationError: error.includes("email")
                ? "Email is already exist"
                : "Username is already exist",
            });
          } else {
            this.props.updateUser(data.user);
            this.props.history.push("/");
          }
        })
        .catch((error) => {
          this.setState({
            requestError: "Not able to login",
          });
        });
    }
  };
  handleChange = ({ target }) => {
    const { name, value } = target;
    let errors = this.state.errors;
    validateUserInfo(value, name, errors);

    this.setState({
      [name]: value,
      errors: errors,
    });
  };
  render() {
    const {
      username,
      email,
      password,
      errors,
      validationError,
      requestError,
    } = this.state;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>
              <p className="server-error">{validationError}</p>
              <p className="server-error">{requestError}</p>
              <form onSubmit={this.handleSubmit}>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="username"
                    value={username}
                    className={`form-control form-control-lg ${
                      errors.username && "error"
                    }`}
                    type="text"
                    placeholder="Username"
                    required
                  />
                  {errors.username ? (
                    <span className="error-msg">{errors.username}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    className={`form-control form-control-lg ${
                      errors.email && "error"
                    }`}
                    type="email"
                    placeholder="Email"
                    required
                  />
                  {errors.email ? (
                    <span className="error-msg">{errors.email}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="password"
                    value={password}
                    className={`form-control form-control-lg ${
                      errors.password && "error"
                    }`}
                    type="password"
                    placeholder="Password"
                    required
                  />
                  {errors.password ? (
                    <span className="error-msg">{errors.password}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <button
                  type="submit"
                  className={`btn btn-lg btn-primary pull-xs-right`}
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function validateUsername(name) {
  return name.length >= 6;
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  return re.test(password) && password.length >= 6;
}

export function validateUserInfo(value, name, errors) {
  switch (name) {
    case "username":
      errors.username = !value.length
        ? "Username is required"
        : !validateUsername(value)
        ? "Username must be atleast 6 characters"
        : "";
      break;
    case "email":
      errors.email = !value.length
        ? "Email is required"
        : !validateEmail(value)
        ? "Email is invalid"
        : "";
      break;
    case "password":
      errors.password = !value.length
        ? "Password is required"
        : !validatePassword(value)
        ? "Password must contain a letter, a number and atleast 6 characters"
        : "";
      break;
    default:
      break;
  }
}

export default withRouter(Register);
