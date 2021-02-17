import { NavLink, Link } from "react-router-dom";

function Header(props) {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
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
              activeClassName="active"
              to="/"
              exact
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/login"
            >
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
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile">
              {/* <img
                src="http://i.imgur.com/Xzm3mI0.jpg"
                className="user-pic"
                alt="user avatar"
              /> */}
              tinkal
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
