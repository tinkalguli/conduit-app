import { Component } from "react";
import ArticleList from "./partials/ArticleList";
import TagList from "./partials/TagList";

class Home extends Component {
  state = {
    activeFeed: "global",
    activeTag: "",
  };
  handleFeedClick = (activeFeed) => {
    if (activeFeed !== this.state.activeTag) {
      this.setState({
        activeFeed: activeFeed,
        activeTag: "",
      });
    }
  };
  handleTagClick = (tag) => {
    this.setState({
      activeTag: tag,
      activeFeed: tag,
    });
  };
  render() {
    const { activeFeed, activeTag } = this.state;
    return (
      <main className="home-page">
        <section className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li
                    onClick={() => this.handleFeedClick("personal")}
                    className={`nav-item nav-link ${
                      activeFeed === "personal" ? "active" : ""
                    }`}
                  >
                    Your Feed
                  </li>
                  <li
                    onClick={() => this.handleFeedClick("global")}
                    className={`nav-item nav-link ${
                      activeFeed === "global" ? "active" : ""
                    }`}
                  >
                    Global Feed
                  </li>
                  {activeTag ? (
                    <li
                      onClick={() => this.handleFeedClick(activeTag)}
                      className={`nav-item nav-link ${
                        activeFeed === activeTag ? "active" : ""
                      }`}
                    >
                      #{activeTag}
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>

              <ArticleList activeFeed={activeFeed} activeTag={activeTag} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <TagList
                  handleTagClick={this.handleTagClick}
                  activeTag={activeTag}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Home;
