import { NavLink, Link } from "react-router-dom";

function Header(props) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <nav>
          {props.isLoggedIn ? (
            <AuthHeader user={props.user} />
          ) : (
            <NonAuthHeader />
          )}
        </nav>
      </div>
    </nav>
  );
}

function NonAuthHeader() {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <NavLink
          className="nav-link"
          activeClassName="active"
          to="/"
          exact
        >
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" activeClassName="active" to="/login">
          Sign In
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          activeClassName="active"
          to="/register"
        >
          Sign Up
        </NavLink>
      </li>
    </ul>
  );
}

function AuthHeader(props) {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <NavLink
          className="nav-link"
          activeClassName="active"
          to="/"
          exact
        >
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/editor">
          <span className="ion-compose">📝</span>&nbsp;New Post
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/settings">
          <span className="ion-compose">⚙️</span>&nbsp;Settings
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          to={`/profiles/${props.user.username}`}
        >
          <img
            src={props.user.image || "http://i.imgur.com/Xzm3mI0.jpg"}
            className="user-pic"
            alt="user avatar"
          />
          {props.user.username}
        </NavLink>
      </li>
    </ul>
  );
}

export default Header;
