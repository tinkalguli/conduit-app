import { Component } from "react";
import { Redirect } from "react-router-dom";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postResponse: null,
    };
  }
  // componentDidMount() {
  //   fetch("/api/user", { authorization: JSON.parse(localStorage.token) })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       this.setState({ postResponse: data });
  //     });
  // }
  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   const { title, description, body, tagList } = this.state;
  //   const article = { title, description, body, tagList };
  //   const errors = this.state.errors;

  //   if (
  //     !errors.title &&
  //     !errors.description &&
  //     !errors.body &&
  //     !errors.tagList
  //   ) {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: localStorage?.token,
  //       },
  //       body: JSON.stringify({ article }),
  //     };
  //     fetch("/api/articles", requestOptions)
  //       .then((response) => response.json())
  //       .then((data) => this.setState({ postResponse: data }));
  //   }
  // };
  // handleChange = ({ target }) => {
  //   let { name, value } = target;
  //   let errors = this.state.errors;
  //   let tags = [];

  //   switch (name) {
  //     case "title":
  //       errors.title = !value.length ? "Title is required" : "";
  //       break;
  //     case "description":
  //       errors.description = !value.length
  //         ? "Description is required"
  //         : value.length < 10
  //         ? "Description must have atleast 10 character"
  //         : "";
  //       break;
  //     case "body":
  //       errors.body = !value.length
  //         ? "Body is required"
  //         : value.length < 20
  //         ? "Body must have atleast 20 character"
  //         : "";
  //       break;
  //     case "tagInput":
  //       if (value.includes(",")) {
  //         tags = value
  //           .trim()
  //           .split(",")
  //           .map((tag) => tag.trim())
  //           .filter((val) => val !== "");
  //         value = "";
  //       }
  //       errors.tagList =
  //         !this.state.tagList.length && !tags.length
  //           ? "TagList is required"
  //           : "";
  //       break;
  //     default:
  //       break;
  //   }

  //   this.setState(({ tagList }) => ({
  //     [name]: value,
  //     tagList: tagList.concat(tags),
  //     errors: errors,
  //   }));
  // };
  // handleTagCancel = (tag) => {
  //   let { tagList } = this.state;
  //   tagList = tagList.filter((val) => val !== tag);
  //   this.setState({ tagList });
  // };
  render() {
    // const { postResponse } = this.state;

    // if (postResponse?.user) {
    //   return <Redirect to={`/articles/${postResponse.article.slug}`} />;
    // }

    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                    />
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
