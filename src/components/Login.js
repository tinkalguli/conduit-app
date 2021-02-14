import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { validateEmail, validatePassword } from "./Register";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
      },
      postResponse: null,
      token: "",
    };
  }
  handleUpdateLocalStorage = () => {
    localStorage.setItem("token", this.state.token);
  };
  // componentDidMount() {
  //   if (localStorage.token) {
  //     this.setState({
  //       token: localStorage.token || "",
  //     });
  //   }
  //   window.addEventListener("beforeunload", this.handleUpdateLocalStorage);
  // }
  // componentWillUnmount() {
  //   window.removeEventListener(
  //     "beforeunload",
  //     this.handleUpdateLocalStorage
  //   );
  // }
  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };
    const errors = this.state.errors;

    if (!errors.email && !errors.password) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      };
      fetch("/api/users/login", requestOptions)
        .then((response) => response.json())
        .then((data) =>
          this.setState(
            () => ({ postResponse: data, token: data?.user?.token }),
            this.handleUpdateLocalStorage
          )
        );
    }
  };
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;

    switch (name) {
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

    this.setState({
      [name]: value,
      errors: errors,
    });
  };
  render() {
    const { email, password, errors, postResponse } = this.state;

    if (postResponse?.user) {
      return <Redirect to="/" />;
    }

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/login">Need an account?</Link>
              </p>
              <p className="server-error">
                {postResponse?.errors?.body[0] || ""}
              </p>
              <form onSubmit={this.handleSubmit}>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    className={`form-control form-control-lg ${
                      errors.email && "error"
                    }`}
                    type="text"
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
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
