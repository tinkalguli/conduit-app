import { Component } from "react";
import { Link } from "react-router-dom";
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
    };
  }
  componentDidMount() {
    const slug = this.props.match.params.slug;
    fetch(`${articleURL}/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        this.setState({
          article: res.article,
        });
      })
      .catch((error) => {
        this.setState({
          error: "Not able to fetch the article",
        });
      });
  }
  render() {
    const { article, error } = this.state;

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
              <button className="btn btn-sm btn-outline-primary">
                <span className="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span className="counter">({article.favoritesCount})</span>
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
              <button className="btn btn-sm btn-outline-secondary">
                <span className="ion-plus-round">➕️</span>
                &nbsp; Follow {article.author.username}{" "}
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-sm btn-outline-primary">
                <span className="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span className="counter">({article.favoritesCount})</span>
              </button>
            </div>
          </div>
          <Comment slug={article.slug} />
        </section>
      </main>
    );
  }
}

export default SingleArticle;
