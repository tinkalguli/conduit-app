import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import TagPills from "./TagPills";
import Pagination from "./Pagination";
import { articleURL, feedURL, localStorageKey } from "../utility/utility";

class ArticleList extends Component {
  state = {
    articleList: null,
    totalArticlesCount: null,
    activePageIndex: 0,
    articlePerPage: 10,
    error: "",
  };
  updateData = (dataName) => {
    const { activeFeed, username, activeTag } = this.props;
    const { activePageIndex, articlePerPage } = this.state;
    let url = articleURL;
    let query =
      dataName === "articleList"
        ? `limit=${articlePerPage}&offset=${
            articlePerPage * activePageIndex
          }`
        : "";

    if (activeTag) {
      query += `&tag=${activeTag}`;
    }

    if (activeFeed === "personal") {
      url = feedURL;
    } else if (activeFeed === "favorited") {
      query += `&favorited=${username}`;
    } else if (activeFeed === "profileFeed") {
      query += `&author=${username}`;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage[localStorageKey]
          ? localStorage.getItem(localStorageKey)
          : "",
      },
    };

    fetch(`${url}?${query}`, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
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
      .catch((errors) => {
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
      prevState.activePageIndex !== this.state.activePageIndex
    ) {
      this.setState({ articleList: null });
      this.updateData("articleList");
      this.updateData("totalArticlesCount");
    }
  }
  handlePageClick = (activePageIndex) => {
    this.setState({
      activePageIndex,
    });
  };
  render() {
    const {
      articleList,
      totalArticlesCount,
      activePageIndex,
      articlePerPage,
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
                <Link
                  to={`/profiles/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
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
          articlePerPage={articlePerPage}
          activePageIndex={activePageIndex}
          totalArticlesCount={totalArticlesCount}
          handlePageClick={this.handlePageClick}
          error={error}
        />
      </>
    );
  }
}

export default ArticleList;
