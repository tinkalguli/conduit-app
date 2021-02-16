import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null,
    };
  }
  componentDidMount() {
    const slug = this.props.slug;
    fetch(`/api/articles/${slug}/comments`, {
      authorization: localStorage?.token,
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          comments: res.comments,
        });
      });
  }
  render() {
    const { comments } = this.state;

    return (
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          <form className="card comment-form">
            <div className="card-block">
              <textarea
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
                Post Comment
              </button>
            </div>
          </form>
          {Comments(comments)}
        </div>
      </div>
    );
  }
}

function Comments(comments) {
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
