import { Component } from "react";
import Loader from "./loader/Loader";

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: null,
    };
  }
  componentDidMount() {
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/tags`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          tagList: res.tags,
        });
      });
  }
  render() {
    const { tagList } = this.state;
    const { activeTag, handleTagClick } = this.props;

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
