import { Component } from "react";
import Loader from "./loader/Loader";
import { tagsURL } from "../utility/utils";

class TagList extends Component {
  state = {
    tagList: null,
    error: "",
  };
  componentDidMount() {
    fetch(tagsURL)
      .then(async (res) => {
        if (!res.ok) {
          const { errors } = await res.json();
          return await Promise.reject(errors);
        }
        return res.json();
      })
      .then((res) => {
        this.setState({
          tagList: res.tags,
        });
      })
      .catch((errors) => {
        this.setState({
          error: "Not able to fetch tags",
        });
      });
  }
  render() {
    const { tagList, error } = this.state;
    const { activeTag, handleTagClick } = this.props;

    if (error) {
      return <p className="">{error}</p>;
    }

    if (!tagList) {
      return <Loader />;
    }

    if (!tagList?.length) {
      return <h5>No tags...</h5>;
    }

    return (
      <ul className="tag-list">
        {tagList.map((tag, i) => (
          <li
            key={i}
            onClick={() => handleTagClick(tag)}
            className={`tag-default tag-pill ${
              activeTag === tag ? "active" : ""
            }`}
          >
            {tag}
          </li>
        ))}
      </ul>
    );
  }
}

export default TagList;
