import { Component } from "react";
import Loader from "./loader/Loader";
import { tagsURL } from "../utility/utility";

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: null,
      error: "",
    };
  }
  componentDidMount() {
    fetch(tagsURL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        this.setState({
          tagList: res.tags,
        });
      })
      .catch((error) => {
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

    if (!tagList?.length) {
      return <h5>No tags...</h5>;
    }

    if (!tagList) {
      return <Loader />;
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
