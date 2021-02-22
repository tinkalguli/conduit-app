import { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import ArticleList from "./partials/ArticleList";
import Loader from "./partials/loader/Loader";
import { localStorageKey, profileURL } from "./utility/utility";

class Profile extends Component {
  state = {
    activeFeed: "profileFeed",
    profileUser: null,
  };
  fetchData = () => {
    const username = this.props.match.params.username;
    if (username === this.props.user.username) {
      this.setState({
        profileUser: this.props.user,
        activeFeed: "personal",
      });
    }
    fetch(`${profileURL}/${username}`, {
      headers: { authorization: localStorage.getItem(localStorageKey) },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ profile }) => {
        this.setState({
          profileUser: profile,
        });
      })
      .catch(() => {
        this.setState({
          error: "Not able to fetch the profile",
        });
      });
  };
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.username !== this.props.match.params.username
    ) {
      this.fetchData();
    }
  }
  handleFeedClick = (activeFeed) => {
    this.setState({
      activeFeed: activeFeed,
    });
  };
  handleFollowClick = (profile) => {
    updateFollowUser(
      profile.username,
      profile.following,
      this.updateFollowedState
    );
  };
  updateFollowedState = (profileUser) => {
    this.setState({
      profileUser,
    });
  };
  render() {
    const { activeFeed, profileUser } = this.state;

    if (!profileUser) {
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
                    profileUser?.image || "http://i.imgur.com/Qr71crq.jpg"
                  }
                  className="user-img"
                  alt="avatar"
                />
                <h4>{profileUser?.username}</h4>
                <p>{profileUser?.bio}</p>
                {profileUser.username === this.props.user.username ? (
                  <Link
                    to="/settings"
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <span className="ion-compose">⚙️</span>&nbsp;Edit
                    Profile Settings
                  </Link>
                ) : (
                  <button
                    onClick={() => this.handleFollowClick(profileUser)}
                    className={`btn btn-sm btn-outline-secondary action-btn ${
                      profileUser.following ? "active" : ""
                    }`}
                  >
                    <span className="ion-plus-round">➕️</span>
                    &nbsp; {profileUser.following
                      ? "Unfollow"
                      : "Follow"}{" "}
                    {profileUser.username}{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  {profileUser.username === this.props.user.username ? (
                    <li
                      onClick={() => this.handleFeedClick("personal")}
                      className={`nav-item nav-link ${
                        activeFeed === "personal" ? "active" : ""
                      }`}
                    >
                      My Articles
                    </li>
                  ) : (
                    <li
                      onClick={() => this.handleFeedClick("profileFeed")}
                      className={`nav-item nav-link ${
                        activeFeed === "profileFeed" ? "active" : ""
                      }`}
                    >
                      {profileUser.username}'s Articles
                    </li>
                  )}
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
                username={profileUser?.username}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function updateFollowUser(
  username,
  following,
  updateFollowedState
) {
  let requestOptions;
  if (!following) {
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
  fetch(`${profileURL}/${username}/follow`, requestOptions)
    .then(async (res) => {
      if (!res.ok) {
        const { errors } = await res.json();
        return await Promise.reject(errors);
      }
      return res.json();
    })
    .then(({ profile }) => updateFollowedState(profile))
    .catch((errors) => {
      console.log(errors);
    });
}

export default withRouter(Profile);
