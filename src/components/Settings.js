import { Component } from "react";
import { withRouter } from "react-router-dom";
import { currentUserURL, localStorageKey } from "./utility/utils";
import { validateUserInfo } from "./Register";
import Spinner from "./partials/spinner/Spinner";

class Settings extends Component {
  state = {
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
    isUpdating: false,
  };
  componentDidMount() {
    this.setState({ ...this.props.user });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isUpdating: true });
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
          authorization: localStorage.getItem(localStorageKey),
        },
        body: JSON.stringify({ user }),
      };

      fetch(currentUserURL, requestOptions)
        .then(async (res) => {
          if (!res.ok) {
            const { errors } = await res.json();
            return await Promise.reject(errors);
          }
          return res.json();
        })
        .then(({ user }) => {
          this.props.updateUser(user);
          this.setState({ isUpdating: false });
          this.props.history.push(`/profiles/${user.username}`);
        })
        .catch((errors) => {
          this.setState({
            updateRequestError: "Not able to update current user",
            isUpdating: false,
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
      isUpdating,
      updateRequestError,
    } = this.state;

    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
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
                    {isUpdating ? <Spinner /> : "Update Settings"}
                  </button>
                </fieldset>
              </form>

              <hr />

              <button
                onClick={() => {
                  this.props.deleteUser();
                  this.props.history.push("/");
                }}
                className="btn btn-outline-danger"
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Settings);
