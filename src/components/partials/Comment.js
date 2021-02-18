import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import { articleURL } from "../utility/utility";
import Spinner from "./spinner/Spinner";

class Comment extends Component {
  state = {
    comments: null,
    fetchRequestError: "",
    postRequestError: "",
    commentBody: "",
    createdComment: null,
  };
  fetchData = () => {
    const slug = this.props.slug;

    fetch(`${articleURL}/${slug}/comments`, {
      authorization: localStorage.getItem("token"),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          comments: data.comments,
        });
      })
      .catch((error) => {
        this.setState({
          fetchRequestError: "Not able to fetch the comments",
        });
      });
  };
  componentDidMount() {
    this.fetchData();
  }
  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      createdComment: "spinning",
    });

    const slug = this.props.slug;
    const { commentBody } = this.state;
    const comment = { body: commentBody };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ comment }),
    };
    fetch(`${articleURL}/${slug}/comments`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => this.setState({ createdComment: data.comment }))
      .then(() => {
        this.fetchData();
      })
      .catch((error) => {
        this.setState({
          postRequestError: "Not able to create the comment",
        });
      });
  };
  handleChange = ({ target }) => {
    let { name, value } = target;

    this.setState({
      [name]: value,
    });
  };
  render() {
    const {
      comments,
      fetchRequestError,
      commentBody,
      createdComment,
    } = this.state;

    return (
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          <form onSubmit={this.handleSubmit} className="card comment-form">
            <div className="card-block">
              <textarea
                name="commentBody"
                onChange={this.handleChange}
                value={commentBody}
                className="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div className="card-footer">
              {/* current user data image */}
              <img
                src="http://i.imgur.com/Qr71crq.jpg"
                className="comment-author-img"
              />
              <button className="btn btn-sm btn-primary">
                {createdComment === "spinning" ? (
                  <Spinner />
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </form>
          {Comments(comments, fetchRequestError)}
        </div>
      </div>
    );
  }
}

function Comments(comments, fetchRequestError) {
  if (fetchRequestError) {
    return <p className="article-preview">{fetchRequestError}</p>;
  }

  if (!comments) {
    return <Loader />;
  }

  if (!comments?.length) {
    return <h5 className="article-preview">No comments...</h5>;
  }

  return comments.map((comment) => (
    <div key={comment?.id} className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to="/profile" className="comment-author">
          <img
            src={comment.author?.image || "http://i.imgur.com/Xzm3mI0.jpg"}
            alt="avatar"
            className="comment-author-img"
          />
        </Link>
        &nbsp;
        <Link to="/profile" className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {moment(comment.createdAt).format("dddd, MMMM Do YYYY")}
        </span>
        <span className="mod-options">
          <span className="ion-edit">✏️</span>
          <span className="ion-trash-a">🗑</span>
        </span>
      </div>
    </div>
  ));
}

export default Comment;
