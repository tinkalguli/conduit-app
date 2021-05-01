import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import TagPills from "./TagPills";
import Pagination from "./Pagination";
import { updateFavoriteArticle } from "../SingleArticle";
import { articleURL, feedURL, localStorageKey } from "../utility/utils";

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
        ? `limit=${articlePerPage}&offset=${articlePerPage * activePageIndex}`
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
            dataName === "articleList" ? data.articles : data.articlesCount,
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
      this.setState(
        ({ activePageIndex }) => ({
          articleList: null,
          activePageIndex:
            prevProps.activeFeed !== this.props.activeFeed
              ? 0
              : activePageIndex,
        }),
        () => {
          this.updateData("articleList");
          this.updateData("totalArticlesCount");
        }
      );
    }
  }
  handlePageClick = (activePageIndex) => {
    this.setState({
      activePageIndex,
    });
  };
  handleFavoriteClick = (slug) => {
    const article = this.state.articleList.find(
      (article) => article.slug === slug
    );
    updateFavoriteArticle(
      article.slug,
      article.favorited,
      this.updateFavoritedState
    );
  };
  updateFavoritedState = (updatedArticle) => {
    const articleList = [...this.state.articleList];
    let favoritedArticle = articleList.find(
      (article) => article.slug === updatedArticle.slug
    );
    favoritedArticle.favorited = updatedArticle.favorited;
    favoritedArticle.favoritesCount = updatedArticle.favoritesCount;
    this.setState({
      articleList,
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
                  src={article.author.image || "http://i.imgur.com/Xzm3mI0.jpg"}
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
              <button
                onClick={() => this.handleFavoriteClick(article.slug)}
                className={`btn btn-outline-primary btn-sm pull-xs-right ${
                  article.favorited ? "active" : ""
                }`}
              >
                <span className="ion-heart">💚</span> {article.favoritesCount}
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
