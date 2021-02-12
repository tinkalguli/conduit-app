export default function TagPills(props) {
  return (
    <ul className="tag-list">
      {props.tagList.map((tag, i) => (
        <li key={i} className="tag-default tag-pill tag-outline">
          {tag}
        </li>
      ))}
    </ul>
  );
}
