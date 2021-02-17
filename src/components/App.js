import { Route } from "react-router-dom";
// import Home from "./Home";
import Dashboard from "./Dashboard";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Login from "./Login";
import Register from "./Register";
import SingleArticle from "./SingleArticle";
import NewArticle from "./NewArticle";
import Settings from "./Settings";
import Profile from "./Profile";

function App() {
  return (
    <>
      <Header />
      {/* <Route path="/" exact>
        <Home />
      </Route> */}
      <Route path="/" exact>
        <Dashboard />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
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

export default App;
