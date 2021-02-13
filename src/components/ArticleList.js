import { Component } from "react";
import Loader from "./partials/loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import TagPills from "./partials/TagPills";

class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: null,
      totalArticlesCount: 0,
      activePage: 1,
    };
  }
  updateData = (data) => {
    const { activeFeed } = this.props;
    let urlPart = "";
    let queryPart =
      data === "articleList"
        ? `limit=10&offset=${10 * (this.state.activePage - 1)}`
        : "";

    if (activeFeed === "personal") {
      urlPart = "/feed";
    } else if (activeFeed !== "personal" && activeFeed !== "global") {
      queryPart += `&tag=${activeFeed}`;
    }

    try {
      fetch(`/api/articles${urlPart}?${queryPart}`)
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            [data]:
              data === "articleList" ? res.articles : res.articlesCount,
          });
        });
    } catch (error) {
      console.error(error.toString());
    }
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
    const { articleList, totalArticlesCount, activePage } = this.state;

    if (!articleList) {
      return <Loader />;
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
        <ul className="pagination">
          {totalArticlesCount
            ? [...Array(Math.ceil(totalArticlesCount / 10))].map(
                (_, i) => (
                  <li
                    onClick={() => this.handlePageClick(i + 1)}
                    className={`page-item ng-scope page-link ng-binding pagination-btn ${
                      activePage === i + 1 ? "active" : ""
                    }`}
                    key={i}
                  >
                    {i + 1}
                  </li>
                )
              )
            : ""}
        </ul>
      </>
    );
  }
}

export default ArticleList;
