import { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "./partials/loader/Loader";
import TagPills from "./partials/TagPills";
import Comment from "./partials/Comment";

class SingleArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
    };
  }
  componentDidMount() {
    const slug = this.props.match.params.slug;
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          article: res.article,
        });
      });
  }
  render() {
    const { article } = this.state;

    if (!article) {
      return <Loader />;
    }

    return (
      <main class="article-page">
        <section class="banner">
          <div class="container">
            <h1>{article.title}</h1>

            <div class="article-meta">
              <Link to="profile">
                <img
                  src={
                    article.author.image ||
                    "http://i.imgur.com/Qr71crq.jpg"
                  }
                  alt="avatar"
                />
              </Link>
              <div class="info">
                <Link to="profile" class="author">
                  {article.author.username}
                </Link>
                <span class="date">
                  {moment(article.createdAt).format("dddd, MMMM Do YYYY")}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-secondary">
                <span class="ion-plus-round">➕️</span>
                &nbsp; Follow {article.author.username}{" "}
              </button>
              &nbsp;&nbsp;
              <button class="btn btn-sm btn-outline-primary">
                <span class="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span class="counter">({article.favoritesCount})</span>
              </button>
            </div>
          </div>
        </section>

        <section class="container page">
          <div class="row article-content">
            <div class="col-md-12">
              <p>{article.body}</p>
              <TagPills tagList={article.tagList} />
            </div>
          </div>

          <hr />

          <div class="article-actions">
            <div class="article-meta">
              <Link to="profile">
                <img
                  src={
                    article.author.image ||
                    "http://i.imgur.com/Qr71crq.jpg"
                  }
                  alt="avatar"
                />
              </Link>
              <div class="info">
                <Link to="profile" class="author">
                  {article.author.username}
                </Link>
                <span class="date">
                  {moment(article.createdAt).format("dddd, MMMM Do YYYY")}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-secondary">
                <span class="ion-plus-round">➕️</span>
                &nbsp; Follow {article.author.username}{" "}
              </button>
              &nbsp;&nbsp;
              <button class="btn btn-sm btn-outline-primary">
                <span class="ion-heart">💚</span>
                &nbsp; Favorite Article{" "}
                <span class="counter">({article.favoritesCount})</span>
              </button>
            </div>
          </div>
          <Comment />
        </section>
      </main>
    );
  }
}

export default SingleArticle;
