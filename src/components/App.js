import { Route } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Login from "./Login";
import Register from "./Register";
import SingleArticle from "./SingleArticle";
import NewArticle from "./NewArticle";
import Settings from "./Settings";
import Profile from "./Profile";
import { Component } from "react";
import { localStorageKey, currentUserURL } from "./utility/utility";
import FullPageSpinner from "./partials/fullPageSpinner/FullPageSpinner";

class App extends Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  };
  componentDidMount() {
    if (localStorage[localStorageKey]) {
      const requestOptions = {
        method: "GET",
        headers: { authorization: localStorage.getItem(localStorageKey) },
      };
      fetch(currentUserURL, requestOptions)
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject(errors);
            });
          }
          return res.json();
        })
        .then(({ user }) => {
          this.updateUser(user);
        })
        .catch((errors) => console.log(errors));
    } else {
      this.setState({ isVerifying: false });
    }
  }
  updateUser = (user) => {
    console.log(user);
    this.setState({ isLoggedIn: true, user, isVerifying: false });
    localStorage.setItem(localStorageKey, user.token);
  };
  render() {
    const { isLoggedIn, user, isVerifying } = this.state;

    if (isVerifying) {
      return <FullPageSpinner />;
    }

    return (
      <>
        <Header isLoggedIn={isLoggedIn} user={user} />
        <Route path="/" exact>
          <Home />
        </Route>
        {/* <Route path="/" exact>
          <Dashboard />
        </Route> */}
        <Route path="/login">
          <Login updateUser={this.updateUser} />
        </Route>
        <Route path="/register">
          <Register updateUser={this.updateUser} />
        </Route>
        <Route path="/editor">
          <NewArticle />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/articles/:slug" component={SingleArticle} />
        <Footer />
      </>
    );
  }
}

export default App;
