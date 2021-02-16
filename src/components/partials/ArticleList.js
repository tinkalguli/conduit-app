import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import TagPills from "./TagPills";
import Pagination from "./Pagination";
import { articleURL, feedURL } from "../utility/utility";

class ArticleList extends Component {
  state = {
    articleList: null,
    totalArticlesCount: null,
    activePage: 1,
    error: "",
  };
  updateData = (dataName) => {
    const { activeFeed } = this.props;
    const { activePage } = this.state;
    let url = articleURL;
    let query =
      dataName === "articleList"
        ? `limit=10&offset=${10 * (activePage - 1)}`
        : "";

    if (activeFeed === "personal") {
      url = feedURL;
    } else if (activeFeed !== "global") {
      query += `&tag=${activeFeed}`;
    }

    fetch(`${url}?${query}`, {
      authorization: localStorage.getItem("token"),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          [dataName]:
            dataName === "articleList"
              ? data.articles
              : data.articlesCount,
        });
      })
      .catch((error) => {
        this.setState({
          error: "Not able to fetch articles",
        });
      });
  };
  componentDidMount() {
    this.updateData("articleList");
    this.updateData("totalArticlesCount");
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.activeFeed !== this.props.activeFeed ||
      prevState.activePage !== this.state.activePage
    ) {
      this.setState({ articleList: null });
      this.updateData("articleList");
      this.updateData("totalArticlesCount");
    }
  }
  handlePageClick = (activePage) => {
    this.setState({
      activePage,
    });
  };
  render() {
    const {
      articleList,
      totalArticlesCount,
      activePage,
      error,
    } = this.state;

    if (error) {
      return <p className="article-preview">{error}</p>;
    }

    if (!articleList && !error) {
      return <Loader />;
    }

    if (!articleList?.length) {
      return <h3 className="article-preview">No articles...</h3>;
    }

    return (
      <>
        {articleList.map((article, i) => (
          <div key={i} className="article-preview">
            <div className="article-meta">
              <a href="profile.html">
                <img
                  src={
                    article.author.image ||
                    "http://i.imgur.com/Xzm3mI0.jpg"
                  }
                  alt="avatar"
                />
              </a>
              <div className="info">
                <a href="profile.html" className="author">
                  {article.author.username}
                </a>
                <span className="date">
                  {moment(article.createdAt).format("dddd, MMMM Do YYYY")}
                </span>
              </div>
              <button className="btn btn-outline-primary btn-sm pull-xs-right">
                <span className="ion-heart">💚</span>{" "}
                {article.favoritesCount}
              </button>
            </div>
            <Link to={`articles/${article.slug}`} className="preview-link">
              <h1>{article.title}</h1>
              <p>{article.description}</p>
              <span>Read more...</span>
              <TagPills tagList={article.tagList} />
            </Link>
          </div>
        ))}
        <Pagination
          activePage={activePage}
          totalArticlesCount={totalArticlesCount}
          handlePageClick={this.handlePageClick}
          error={error}
        />
      </>
    );
  }
}

export default ArticleList;
