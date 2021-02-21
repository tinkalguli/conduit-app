import { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import moment from "moment";
import Loader from "./partials/loader/Loader";
import TagPills from "./partials/TagPills";
import Comment from "./partials/Comment";
import ReactMarkdown from "react-markdown";
import { articleURL, localStorageKey } from "./utility/utility";

class SingleArticle extends Component {
  state = {
    article: null,
    error: "",
  };
  componentDidMount() {
    const slug = this.props.match.params.slug;
    fetch(`${articleURL}/${slug}`, {
      headers: { authorization: localStorage.getItem(localStorageKey) },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          article: data.article,
        });
      })
      .catch(() => {
        this.setState({
          error: "Not able to fetch the article",
        });
      });
  }
  handleDeleteArticle = () => {
    const slug = this.props.match.params.slug;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem(localStorageKey),
      },
    };
    fetch(`${articleURL}/${slug}`, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
        }
        return res.json();
      })
      .then(() => this.props.history.push("/"))
      .catch((errors) => {
        console.log(errors);
      });
  };
  handleFavoriteClick = () => {
    const { article } = this.state;
    updateFavoriteArticle(article.slug, article.favorited);
  };
  render() {
    const { article, error } = this.state;
    const { user } = this.props;

    if (error) {
      return <center className="article-preview">{error}</center>;
    }

    if (!article) {
      return <Loader />;
    }

    return (
      <main className="article-page">
        <section className="banner">
          <div className="container">
            <h1>{article.title}</h1>

            <div className="article-meta">
              <Link to="profile">
                <img
                  src={
                    article.author.image ||
                    "http://i.imgur.com/Qr71crq.jpg"
                  }
                  alt="avatar"
                />
              </Link>
              <div className="info">
                <Link to="profile" className="author">
                  {article.author.username}
                </Link>
                <span className="date">
                  {moment(article.createdAt).format("dddd, MMMM Do YYYY")}
                </span>
              </div>
              {article.author.username === user.username ? (
                <Link
                  to="/editor"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <span>✏️</span>
                  &nbsp;Edit Article{" "}
                </Link>
              ) : (
                <button className="btn btn-sm btn-outline-secondary">
                  <span className="ion-plus-round">➕️</span>
                  &nbsp; Follow {article.author.username}{" "}
                </button>
              )}
              &nbsp;&nbsp;
              {article.author.username === user.username ? (
                <button
                  onClick={this.handleDeleteArticle}
                  className="btn btn-outline-danger btn-sm"
                >
                  <span>🗑</span>
                  &nbsp; Delete Article{" "}
                </button>
              ) : (
                <button
                  onClick={this.handleFavoriteClick}
                  className={`btn btn-sm btn-outline-primary ${
                    article.favorited ? "active" : ""
                  }`}
                >
                  <span className="ion-heart">💚</span>
                  &nbsp; Favorite Article{" "}
                  <span className="counter">
                    ({article.favoritesCount})
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <ReactMarkdown source={article.body} />
              <TagPills tagList={article.tagList} />
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link to="profile">
                <img
                  src={
                    article.author.image ||
                    "http://i.imgur.com/Qr71crq.jpg"
                  }
                  alt="avatar"
                />
              </Link>
              <div className="info">
                <Link to="profile" className="author">
                  {article.author.username}
                </Link>
                <span className="date">
                  {moment(article.createdAt).format("dddd, MMMM Do YYYY")}
                </span>
              </div>
              {article.author.username === user.username ? (
                <Link
                  to="/editor"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <span>✏️</span>
                  &nbsp;Edit Article{" "}
                </Link>
              ) : (
                <button className="btn btn-sm btn-outline-secondary">
                  <span className="ion-plus-round">➕️</span>
                  &nbsp; Follow {article.author.username}{" "}
                </button>
              )}
              &nbsp;&nbsp;
              {article.author.username === user.username ? (
                <button
                  onClick={this.handleDeleteArticle}
                  className="btn btn-outline-danger btn-sm"
                >
                  <span>🗑</span>
                  &nbsp; Delete Article{" "}
                </button>
              ) : (
                <button
                  onClick={this.handleFavoriteClick}
                  className={`btn btn-sm btn-outline-primary ${
                    article.favorited ? "active" : ""
                  }`}
                >
                  <span className="ion-heart">💚</span>
                  &nbsp; Favorite Article{" "}
                  <span className="counter">
                    ({article.favoritesCount})
                  </span>
                </button>
              )}
            </div>
          </div>
          <Comment slug={article.slug} user={user} />
        </section>
      </main>
    );
  }
}

function updateFavoriteArticle(slug, isFavorited) {
  let requestOptions;
  if (!isFavorited) {
    requestOptions = {
      method: "POST",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
  } else {
    requestOptions = {
      method: "DELETE",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
  }
  fetch(`${articleURL}/${slug}/favorite`, requestOptions);
}

export default withRouter(SingleArticle);
