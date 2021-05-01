import { Component } from "react";
import { withRouter } from "react-router-dom";
import Loader from "./partials/loader/Loader";
import Spinner from "./partials/spinner/Spinner";
import { articleURL, localStorageKey } from "./utility/utils";

class UpdateArticle extends Component {
  state = {
    title: "",
    description: "",
    body: "",
    tagList: [],
    article: null,
    errors: {
      description: "",
      body: "",
      title: "",
      tagList: "",
    },
    isUpdating: false,
    tagInput: "",
    requestError: "",
  };
  componentDidMount() {
    const slug = this.props.match.params.slug;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem(localStorageKey),
      },
    };

    fetch(`${articleURL}/${slug}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ article }) => {
        this.setState({ ...article, article });
      })
      .catch(() => {
        this.setState({
          error: "Not able to fetch the article",
        });
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      isUpdating: true,
    });
    const { title, description, body, tagList } = this.state;
    const article = { title, description, body, tagList };
    const errors = this.state.errors;
    const slug = this.props.match.params.slug;

    if (
      !errors.title &&
      !errors.description &&
      !errors.body &&
      !errors.tagList
    ) {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem(localStorageKey),
        },
        body: JSON.stringify({ article }),
      };
      fetch(`${articleURL}/${slug}`, requestOptions)
        .then(async (res) => {
          if (!res.ok) {
            const { errors } = await res.json();
            return await Promise.reject(errors);
          }
          return res.json();
        })
        .then(({ article }) => {
          this.setState({
            isUpdating: false,
          });
          this.props.history.push(`/articles/${article.slug}`);
        })
        .catch(() => {
          this.setState({
            requestError: "Not able to update the article",
            isUpdating: false,
          });
        });
    }
  };
  handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = this.state.errors;
    let tags = [];

    if (name === "tagInput" && value.includes(",")) {
      tags = value
        .trim()
        .split(",")
        .map((tag) => tag.trim())
        .filter((val) => val !== "");
      value = "";
    }

    validateArticleInfo(value, name, errors);

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
      article,
      errors,
      isUpdating,
      tagInput,
      requestError,
    } = this.state;

    if (!article) {
      return <Loader />;
    }

    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form onSubmit={this.handleSubmit}>
                <p className="server-error">{requestError}</p>
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
                    value={body}
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
                  {isUpdating ? <Spinner /> : "Update Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function validateArticleInfo(value, name, errors) {
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
    default:
      break;
  }
}

export default withRouter(UpdateArticle);
