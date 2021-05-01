import { Component } from "react";
import Loader from "./loader/Loader";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import { articleURL, localStorageKey } from "../utility/utils";
import Spinner from "./spinner/Spinner";

class Comment extends Component {
  state = {
    comments: null,
    fetchRequestError: "",
    postRequestError: "",
    commentBody: "",
    isCreatingComment: false,
  };
  componentDidMount() {
    const slug = this.props.slug;

    fetch(`${articleURL}/${slug}/comments`, {
      authorization: localStorage.getItem(localStorageKey),
    })
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
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
  }
  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      isCreatingComment: true,
    });

    const slug = this.props.slug;
    const { commentBody } = this.state;
    const comment = { body: commentBody };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem(localStorageKey),
      },
      body: JSON.stringify({ comment }),
    };
    fetch(`${articleURL}/${slug}/comments`, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
        }
        return res.json();
      })
      .then(({ comment }) => {
        let comments = [...this.state.comments];
        comments.unshift(comment);
        this.setState({
          comments,
          isCreatingComment: false,
          commentBody: "",
        });
      })
      .catch((errors) => {
        this.setState({
          postRequestError: "Not able to create the comment",
          isCreatingComment: false,
        });
      });
  };
  handleChange = ({ target }) => {
    let { name, value } = target;

    this.setState({
      [name]: value,
    });
  };
  handleDeleteComment = (id) => {
    const slug = this.props.slug;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem(localStorageKey),
      },
    };
    fetch(`${articleURL}/${slug}/comments/${id}`, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
        }
        return res.json();
      })
      .then(() => {
        let filteredComments = [...this.state.comments].filter(
          (comment) => comment.id !== id
        );
        this.setState({
          comments: filteredComments,
        });
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  render() {
    const {
      comments,
      fetchRequestError,
      commentBody,
      isCreatingComment,
    } = this.state;

    return (
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          {this.props.user ? (
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
                <img
                  src={
                    this.props?.user?.image || "http://i.imgur.com/Xzm3mI0.jpg"
                  }
                  className="comment-author-img"
                  alt="current user avatar"
                />
                <button className="btn btn-sm btn-primary">
                  {isCreatingComment ? <Spinner /> : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            ""
          )}
          <Comments
            comments={comments}
            fetchRequestError={fetchRequestError}
            currentUser={this.props.user}
            handleDeleteComment={this.handleDeleteComment}
          />
        </div>
      </div>
    );
  }
}

function Comments(props) {
  if (props.fetchRequestError) {
    return <p className="article-preview">{props.fetchRequestError}</p>;
  }

  if (!props.comments) {
    return <Loader />;
  }

  if (!props.comments?.length) {
    return <h5 className="article-preview">No comments...</h5>;
  }

  return props.comments.map((comment) => (
    <div key={comment?.id} className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`/profiles/${comment.author.username}`}
          className="comment-author"
        >
          <img
            src={comment.author?.image || "http://i.imgur.com/Xzm3mI0.jpg"}
            alt="avatar"
            className="comment-author-img"
          />
        </Link>
        &nbsp;
        <Link
          to={`/profiles/${comment.author.username}`}
          className="comment-author"
        >
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {moment(comment.createdAt).format("dddd, MMMM Do YYYY")}
        </span>
        {props.currentUser.username === comment.author.username ? (
          <div className="mod-options">
            {/* <span className="ion-edit">✏️</span> */}
            <span
              onClick={() => props.handleDeleteComment(comment.id)}
              className="ion-trash-a"
            >
              🗑
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  ));
}

export default withRouter(Comment);
