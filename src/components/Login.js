import { Component } from "react";
import { Link } from "react-router-dom";
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
    };
  }
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        errors.email =
          value.length === 0
            ? "Name is required"
            : !validateEmail(value)
            ? "Email should contain a @ symbol"
            : "";
        break;
      case "password":
        errors.password =
          value.length === 0
            ? "Name is required"
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
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/login">Need an account?</Link>
              </p>

              <form>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="email"
                    value={this.state.email}
                    className={`form-control form-control-lg ${
                      errors.email && "error"
                    }`}
                    type="text"
                    placeholder="Email"
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
                  />
                  {errors.password ? <span>{errors.password}</span> : ""}
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
