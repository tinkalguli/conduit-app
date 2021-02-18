import { Component } from "react";
import { Redirect } from "react-router-dom";
import { currentUserURL } from "./utility/utility";
import { validateUserInfo } from "./Register";
import Loader from "./partials/loader/Loader";

class Settings extends Component {
  state = {
    currentUser: null,
    fetchRequestError: "",
    updatedUser: null,
    updateRequestError: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    image: "",
    errors: {
      username: "",
      email: "",
      password: "",
    },
  };
  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    fetch(currentUserURL, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        const currentUser = data.user;
        this.setState({
          currentUser,
          username: currentUser?.username,
          email: currentUser?.email,
          bio: currentUser?.bio,
          image: currentUser?.image,
        });
      })
      .catch((error) => {
        this.setState({
          fetchRequestError: "Not able to fetch current user data",
        });
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, bio, image, password } = this.state;
    let user = { username, email, bio, image };
    if (password) {
      user.password = password;
    }
    const errors = this.state.errors;

    if (!errors.username && !errors.email && !errors.password) {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ user }),
      };

      fetch(currentUserURL, requestOptions)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => this.setState({ updatedUser: data.user }))
        .catch((error) => {
          this.setState({
            updateRequestError: "Not able to update current user",
          });
        });
    }
  };
  handleChange = ({ target }) => {
    const { name, value } = target;
    let errors = this.state.errors;

    if (name === "password" && !value.length) {
      errors.password = "";
    }

    if (
      (name === "password" && value.length) ||
      name === "username" ||
      name === "email"
    ) {
      validateUserInfo(value, name, errors);
    }

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
      bio,
      image,
      errors,
      updatedUser,
      currentUser,
      fetchRequestError,
      updateRequestError,
    } = this.state;

    if (updatedUser) {
      return <Redirect to="/profile" />;
    }

    if (!currentUser) {
      return <Loader />;
    }

    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              <p className="server-error">{fetchRequestError}</p>
              <p className="server-error">{updateRequestError}</p>
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      value={image}
                      name="image"
                      onChange={this.handleChange}
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      value={username}
                      name="username"
                      onChange={this.handleChange}
                      className="form-control form-control-lg"
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
                    <textarea
                      value={bio}
                      name="bio"
                      onChange={this.handleChange}
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      value={email}
                      name="email"
                      onChange={this.handleChange}
                      className="form-control form-control-lg"
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
                      value={password}
                      name="password"
                      onChange={this.handleChange}
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                    />
                    {errors.password ? (
                      <span className="error-msg">{errors.password}</span>
                    ) : (
                      ""
                    )}
                  </fieldset>
                  <button className="btn btn-lg btn-primary pull-xs-right">
                    Update Settings
                  </button>
                </fieldset>
              </form>

              <hr />

              <button className="btn btn-outline-danger">
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
