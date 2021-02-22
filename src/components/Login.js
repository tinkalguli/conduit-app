import { Component } from "react";
import { Link } from "react-router-dom";
import { loginURL } from "./utility/utility";
import { validateUserInfo } from "./Register";
import { withRouter } from "react-router-dom";
import Spinner from "./partials/spinner/Spinner";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    },
    requestError: "",
    validationError: "",
    isLogging: false,
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLogging: true });
    const { email, password } = this.state;
    const user = { email, password };
    const errors = this.state.errors;

    if (!errors.email && !errors.password) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      };
      fetch(loginURL, requestOptions)
        .then((res) => {
          if (res.status !== 422 && !res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          if (data.errors) {
            this.setState({
              validationError: data.errors.body[0],
            });
          } else {
            this.props.updateUser(data.user);
            this.props.history.push("/");
          }
          this.setState({ isLogging: false });
        })
        .catch((error) => {
          this.setState({
            requestError: "Not able to login",
            isLogging: false,
          });
        });
    }
  };
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;

    validateUserInfo(value, name, errors);

    this.setState({
      [name]: value,
      errors: errors,
    });
  };
  render() {
    const {
      email,
      password,
      errors,
      validationError,
      requestError,
      isLogging,
    } = this.state;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/login">Need an account?</Link>
              </p>
              <p className="server-error">{validationError}</p>
              <p className="server-error">{requestError}</p>
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
                  {isLogging ? <Spinner /> : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
