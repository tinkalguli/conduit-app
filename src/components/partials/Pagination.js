export default function Pagination(props) {
  return (
    <ul className="pagination">
      {props.totalArticlesCount
        ? [...Array(Math.ceil(props.totalArticlesCount / 10))].map(
            (_, i) => (
              <li
                onClick={() => props.handlePageClick(i + 1)}
                className={`page-item ng-scope page-link ng-binding pagination-btn ${
                  props.activePage === i + 1 ? "active" : ""
                }`}
                key={i}
              >
                {i + 1}
              </li>
            )
          )
        : ""}
    </ul>
  );
}
