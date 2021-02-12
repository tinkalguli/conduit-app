import { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      errors: {
        name: "",
        email: "",
        password: "",
      },
    };
  }
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;

    switch (name) {
      case "name":
        errors.name =
          value.length === 0
            ? "Name is required"
            : !validateName(value)
            ? "Name must be atleast 6 characters"
            : "";
        break;
      case "email":
        errors.email =
          value.length === 0
            ? "Name is required"
            : !validateEmail(value)
            ? "Email should contain a '@' symbol"
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
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <form>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="name"
                    value={this.state.name}
                    className={`form-control form-control-lg ${
                      errors.name && "error"
                    }`}
                    type="text"
                    placeholder="Your Name"
                  />
                  {errors.name ? (
                    <span className="error-msg">{errors.name}</span>
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

function validateName(name) {
  return name.length >= 6;
}

export function validateEmail(email) {
  return email.includes("@");
}

export function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  return re.test(password) && password.length >= 6;
}

export default Register;
