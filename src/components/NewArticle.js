import { Component } from "react";
import { Redirect } from "react-router-dom";

class NewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      body: "",
      tagList: [],
      errors: {
        description: "",
        body: "",
        title: "",
        tagList: "",
      },
      tagInput: "",
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const { title, description, body, tagList } = this.state;
    const article = { title, description, body, tagList };
    const errors = this.state.errors;

    if (
      !errors.title &&
      !errors.description &&
      !errors.body &&
      !errors.tagList
    ) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage?.token,
        },
        body: JSON.stringify({ article }),
      };
      fetch("/api/articles", requestOptions)
        .then((response) => response.json())
        .then((data) => this.setState({ postResponse: data }));
    }
  };
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;
    let tags = [];

    switch (name) {
      case "title":
        errors.title = !value.length ? "Title is required" : "";
        break;
      case "description":
        errors.description = !value.length
          ? "Description is required"
          : value.length < 10
          ? "Description must have atleast 10 character"
          : "";
        break;
      case "body":
        errors.body = !value.length
          ? "Body is required"
          : value.length < 20
          ? "Body must have atleast 20 character"
          : "";
        break;
      case "tagInput":
        if (value.includes(",")) {
          tags = value
            .trim()
            .split(",")
            .map((tag) => tag.trim())
            .filter((val) => val !== "");
          value = "";
        }
        errors.tagList =
          !this.state.tagList.length && !tags.length
            ? "TagList is required"
            : "";
        break;
      default:
        break;
    }

    this.setState(({ tagList }) => ({
      [name]: value,
      tagList: tagList.concat(tags),
      errors: errors,
    }));
  };
  handleTagCancel = (tag) => {
    let { tagList } = this.state;
    tagList = tagList.filter((val) => val !== tag);
    this.setState({ tagList });
  };
  render() {
    const {
      title,
      description,
      body,
      tagList,
      errors,
      tagInput,
      postResponse,
    } = this.state;

    if (postResponse?.article) {
      return <Redirect to={`/articles/${postResponse.article.slug}`} />;
    }

    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form onSubmit={this.handleSubmit}>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="title"
                    value={title}
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    required
                  />
                  {errors.title ? (
                    <span className="error-msg">{errors.title}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    onChange={this.handleChange}
                    name="description"
                    value={description}
                    className="form-control"
                    rows="4"
                    placeholder="Write a description"
                    required
                  ></textarea>
                  {errors.description ? (
                    <span className="error-msg">{errors.description}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    onChange={this.handleChange}
                    name="body"
                    valu={body}
                    className="form-control"
                    rows="10"
                    placeholder="Write your post (in markdown)"
                    required
                  ></textarea>
                  {errors.body ? (
                    <span className="error-msg">{errors.body}</span>
                  ) : (
                    ""
                  )}
                </fieldset>
                <fieldset className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="tagInput"
                    value={tagInput}
                    className="form-control"
                    type="text"
                    placeholder="Enter comma ' , ' after typing a tag"
                  />
                  {errors.tagList ? (
                    <span className="error-msg">{errors.tagList}</span>
                  ) : (
                    ""
                  )}
                  <ul className="tag-list">
                    {tagList.map((tag, i) => (
                      <li key={i} className="tag-default tag-pill">
                        <span
                          onClick={() => this.handleTagCancel(tag)}
                          className="close-round"
                        >
                          x
                        </span>{" "}
                        {tag}
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Create Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewArticle;
