import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Login from "./Login";
import Register from "./Register";
import SingleArticle from "./SingleArticle";
import NewArticle from "./NewArticle";
import Settings from "./Settings";
import { Component } from "react";
import { localStorageKey, currentUserURL } from "./utility/utility";
import FullPageSpinner from "./partials/fullPageSpinner/FullPageSpinner";
import NoMatch from "./NoMatch";
import Profile from "./Profile";
import UpdateArticle from "./UpdateArticle";

class App extends Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  };
  componentDidMount() {
    const token = localStorage.getItem(localStorageKey);
    if (token) {
      const requestOptions = {
        method: "GET",
        headers: { authorization: localStorage.getItem(localStorageKey) },
      };
      fetch(currentUserURL, requestOptions)
        .then(async (res) => {
          if (!res.ok) {
            const { errors } = await res.json();
            return await Promise.reject(errors);
          }
          return res.json();
        })
        .then(({ user }) => {
          this.updateUser(user);
        })
        .catch((errors) => {
          console.log(errors);
          this.setState({ isVerifying: false });
        });
    } else {
      this.setState({ isVerifying: false });
    }
  }
  updateUser = (user) => {
    this.setState({ isLoggedIn: true, user, isVerifying: false });
    localStorage.setItem(localStorageKey, user.token);
  };
  deleteUser = () => {
    this.setState({ isLoggedIn: false, user: null });
    localStorage.setItem(localStorageKey, "");
  };
  render() {
    const { isLoggedIn, user, isVerifying } = this.state;

    if (isVerifying) {
      return <FullPageSpinner />;
    }

    return (
      <>
        <Header isLoggedIn={isLoggedIn} user={user} />
        {isLoggedIn ? (
          <AuthenticatedApp
            user={user}
            updateUser={this.updateUser}
            deleteUser={this.deleteUser}
          />
        ) : (
          <UnAuthenticatedApp updateUser={this.updateUser} />
        )}
        <Footer />
      </>
    );
  }
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Dashboard />
      </Route>
      <Route path="/editor">
        <NewArticle />
      </Route>
      <Route path="/settings">
        <Settings
          user={props.user}
          updateUser={props.updateUser}
          deleteUser={props.deleteUser}
        />
      </Route>
      <Route path="/profiles/:username">
        <Profile user={props.user} />
      </Route>
      <Route path="/articles/:slug">
        <SingleArticle user={props.user} />
      </Route>
      <Route path="/editor/:slug">
        <UpdateArticle />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}

function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login">
        <Login updateUser={props.updateUser} />
      </Route>
      <Route path="/register">
        <Register updateUser={props.updateUser} />
      </Route>
      <Route path="/articles/:slug" component={SingleArticle} />
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}

export default App;
