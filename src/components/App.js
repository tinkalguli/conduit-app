import { Route } from "react-router-dom";
import Home from "./Home";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Login from "./Login";
import Register from "./Register";
import SingleArticle from "./SingleArticle";
import NewArticle from "./NewArticle";
import Settings from "./Settings";

function App() {
  return (
    <>
      <Header />
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/editor" component={NewArticle} />
      <Route path="/settings" component={Settings} />
      <Route path="/articles/:slug" component={SingleArticle} />
      <Footer />
    </>
  );
}

export default App;
