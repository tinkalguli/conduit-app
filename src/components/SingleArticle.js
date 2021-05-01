import { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import Loader from "./partials/loader/Loader";
import TagPills from "./partials/TagPills";
import Comment from "./partials/Comment";
import ReactMarkdown from "react-markdown";
import { updateFollowUser } from "./Profile";
import { articleURL, localStorageKey } from "./utility/utils";

class SingleArticle extends Component {
  state = {
    article: null,
    error: "",
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
    updateFavoriteArticle(
      article.slug,
      article.favorited,
      this.updateFavoritedState
    );
  };
  handleFollowClick = (author) => {
    updateFollowUser(
      author.username,
      author.following,
      this.updateFollowedState
    );
  };
  updateFavoritedState = (article) => {
    this.setState({
      article,
    });
  };
  updateFollowedState = (profile) => {
    const article = { ...this.state.article };
    article.author = profile;
    this.setState({
      article,
    });
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

            {
              <ArticleMeta
                user={user}
                article={article}
                handleDeleteArticle={this.handleDeleteArticle}
                handleFavoriteClick={this.handleFavoriteClick}
                handleFollowClick={this.handleFollowClick}
              />
            }
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
            {
              <ArticleMeta
                user={user}
                article={article}
                handleDeleteArticle={this.handleDeleteArticle}
                handleFavoriteClick={this.handleFavoriteClick}
                handleFollowClick={this.handleFollowClick}
              />
            }
          </div>
          <Comment slug={article.slug} user={user} />
        </section>
      </main>
    );
  }
}

function ArticleMeta(props) {
  const { article, user } = props;
  return (
    <div className="article-meta">
      <Link to={`/profiles/${article.author.username}`}>
        <img
          src={article.author.image || "http://i.imgur.com/Xzm3mI0.jpg"}
          alt="avatar"
        />
      </Link>
      <div className="info">
        <Link to={`/profiles/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {moment(article?.createdAt).format("dddd, MMMM Do YYYY")}
        </span>
      </div>
      {article.author.username === user?.username ? (
        <Link
          to={`/editor/${article.slug}`}
          className="btn btn-outline-secondary btn-sm"
        >
          <span>✏️</span>
          &nbsp;Edit Article{" "}
        </Link>
      ) : (
        <button
          onClick={() => props.handleFollowClick(article.author)}
          className={`btn btn-sm btn-outline-secondary ${
            article.author.following ? "active" : ""
          }`}
        >
          <span className="ion-plus-round">➕️</span>
          &nbsp; {article.author.following ? "Unfollow" : "Follow"}{" "}
          {article.author.username}{" "}
        </button>
      )}
      &nbsp;&nbsp;
      {article.author?.username === user?.username ? (
        <button
          onClick={props.handleDeleteArticle}
          className="btn btn-outline-danger btn-sm"
        >
          <span>🗑</span>
          &nbsp; Delete Article{" "}
        </button>
      ) : (
        <button
          onClick={props.handleFavoriteClick}
          className={`btn btn-sm btn-outline-primary ${
            article.favorited ? "active" : ""
          }`}
        >
          <span className="ion-heart">💚</span>
          &nbsp; Favorite Article{" "}
          <span className="counter">({article.favoritesCount})</span>
        </button>
      )}
    </div>
  );
}

export function updateFavoriteArticle(slug, isFavorited, updateFavoritedState) {
  let requestOptions;
  if (!isFavorited) {
    requestOptions = {
      method: "POST",
      headers: {
        authorization: localStorage.getItem(localStorageKey),
      },
    };
  } else {
    requestOptions = {
      method: "DELETE",
      headers: {
        authorization: localStorage.getItem(localStorageKey),
      },
    };
  }
  fetch(`${articleURL}/${slug}/favorite`, requestOptions)
    .then(async (res) => {
      if (!res.ok) {
        const { errors } = await res.json();
        return await Promise.reject(errors);
      }
      return res.json();
    })
    .then(({ article }) => updateFavoritedState(article))
    .catch((errors) => {
      console.log(errors);
    });
}

export default withRouter(SingleArticle);
