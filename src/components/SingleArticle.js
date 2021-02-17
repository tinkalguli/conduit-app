import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import Loader from "./partials/loader/Loader";
import TagPills from "./partials/TagPills";
import Comment from "./partials/Comment";
import ReactMarkdown from "react-markdown";
import { articleURL } from "./utility/utility";

class SingleArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      error: "",
      deletedArticle: null,
    };
  }
  componentDidMount() {
    const slug = this.props.match.params.slug;
    fetch(`${articleURL}/${slug}`, {
      headers: { authorization: localStorage.getItem("token") },
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
      .catch((error) => {
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
        authorization: localStorage.getItem("token"),
      },
    };
    fetch(`${articleURL}/${slug}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => this.setState({ deletedArticle: data }));
  };
  handleFavoriteClick = () => {
    const { article } = this.state;
    updateFavoriteArticle(article.slug, article.favorited);
  };
  render() {
    const { article, error, deletedArticle } = this.state;

    if (deletedArticle) {
      return <Redirect to="/" />;
    }

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
              <button className="btn btn-sm btn-outline-secondary">
                <span className="ion-plus-round">➕️</span>
                &nbsp; Follow {article.author.username}{" "}
              </button>
              &nbsp;&nbsp;
              <button
                onClick={this.handleFavoriteClick}
                className={`btn btn-sm btn-outline-primary ${
                  article.favorited ? "active" : ""
                }`}
              >
                <span className="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span className="counter">({article.favoritesCount})</span>
              </button>
              <Link
                to="/editor"
                className="btn btn-outline-secondary btn-sm"
              >
                <span>✏️</span>
                &nbsp;Edit Article{" "}
              </Link>
              &nbsp;&nbsp;
              <button
                onClick={this.handleDeleteArticle}
                className="btn btn-outline-danger btn-sm"
              >
                <span>🗑</span>
                &nbsp; Delete Article{" "}
              </button>
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
              {/* <button className="btn btn-sm btn-outline-secondary">
                <span className="ion-plus-round">➕️</span>
                &nbsp; Follow {article.author.username}{" "}
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-sm btn-outline-primary">
                <span className="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span className="counter">({article.favoritesCount})</span>
              </button> */}
              <Link
                to="/editor"
                className="btn btn-outline-secondary btn-sm"
              >
                <span>✏️</span>
                &nbsp;Edit Article{" "}
              </Link>
              &nbsp;&nbsp;
              <button className="btn btn-outline-danger btn-sm">
                <span>🗑</span>
                &nbsp; Delete Article{" "}
              </button>
            </div>
          </div>
          <Comment slug={article.slug} />
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

export default SingleArticle;
