import { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: {
        username: "",
        email: "",
        password: "",
      },
      postResponse: null,
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const user = { username, email, password };
    const errors = this.state.errors;

    if (!errors.username && !errors.email && !errors.password) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user }),
      };
      fetch("/api/users", requestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({ postResponse: data }));
    }
  };
  handleChange = ({ target }) => {
    const { name, value } = target;
    let errors = this.state.errors;

    switch (name) {
      case "username":
        errors.username =
          value.length === 0
            ? "Username is required"
            : !validateUsername(value)
            ? "Username must be atleast 6 characters"
            : "";
        break;
      case "email":
        errors.email =
          value.length === 0
            ? "Email is required"
            : !validateEmail(value)
            ? "Email is invalid"
            : "";
        break;
      case "password":
        errors.password =
          value.length === 0
            ? "Password is required"
            : !validatePassword(value)
            ? "Password must contain a letter, a number and atleast 6 characters"
            : "";
        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      errors: errors,
    });
  };
  render() {
    const errors = this.state.errors;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <form onSubmit={this.handleSubmit}>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="username"
                    value={this.state.username}
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
                    value={this.state.email}
                    className={`form-control form-control-lg ${
                      errors.email && "error"
                    }`}
                    type="email"
                    placeholder="Email"
                    required
                  />
                  {errors.email ? <span>{errors.email}</span> : ""}
                </fieldset>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="password"
                    value={this.state.password}
                    className={`form-control form-control-lg ${
                      errors.password && "error"
                    }`}
                    type="password"
                    placeholder="Password"
                    required
                  />
                  {errors.password ? <span>{errors.password}</span> : ""}
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

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  return re.test(password) && password.length >= 6;
}

export default Register;
