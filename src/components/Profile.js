import { Component } from "react";
import { Link } from "react-router-dom";
import ArticleList from "./partials/ArticleList";
import { currentUserURL, localStorageKey } from "./utility/utility";
import Loader from "./partials/loader/Loader";

class Profile extends Component {
  state = {
    activeFeed: "personal",
    requestError: "",
    currentUser: null,
  };
  // componentDidMount() {
  //   fetch(currentUserURL, {
  //     headers: { authorization: localStorage.getItem(localStorageKey) },
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(res.statusText);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       this.setState({ currentUser: data.user });
  //     })
  //     .catch((error) => {
  //       this.setState({
  //         requestError: "Not able to fetch current user data",
  //       });
  //     });
  // }
  handleFeedClick = (activeFeed) => {
    this.setState({
      activeFeed: activeFeed,
    });
  };
  render() {
    const { currentUser, requestError, activeFeed } = this.state;

    if (requestError) {
      return <p className="article-preview">{requestError}</p>;
    }

    if (!currentUser) {
      return <Loader />;
    }

    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  src={
                    currentUser?.image || "http://i.imgur.com/Qr71crq.jpg"
                  }
                  className="user-img"
                />
                <h4>{currentUser?.username}</h4>
                <p>{currentUser?.bio}</p>
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <span className="ion-compose">⚙️</span>&nbsp;Edit Profile
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
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
                    onClick={() => this.handleFeedClick("favorited")}
                    className={`nav-item nav-link ${
                      activeFeed === "favorited" ? "active" : ""
                    }`}
                  >
                    Favorited Articles
                  </li>
                </ul>
              </div>

              <ArticleList
                activeFeed={activeFeed}
                username={currentUser?.username}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
