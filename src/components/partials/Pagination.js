export default function Pagination(props) {
  const {
    totalArticlesCount,
    articlePerPage,
    activePageIndex,
    handlePageClick,
  } = props;
  return (
    <ul className="pagination">
      {totalArticlesCount
        ? [...Array(Math.ceil(totalArticlesCount / articlePerPage))].map(
            (_, i) => (
              <li
                onClick={() => handlePageClick(i)}
                className={`page-item ng-scope page-link ng-binding pagination-btn ${
                  activePageIndex === i ? "active" : ""
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
