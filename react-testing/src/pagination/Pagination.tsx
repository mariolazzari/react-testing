import { range } from "../utils";

type Props = {
  total: number;
  limit: number;
  currentPage: number;
  selectPage?: (page: number) => void;
};

const Pagination = ({ total, limit, currentPage, selectPage }: Props) => {
  const pagesCount = Math.ceil(total / limit);
  const pages = range(1, pagesCount + 1);

  return (
    <ul className="pagination">
      {pages.map(page => (
        <li
          data-testid="page-container"
          key={page}
          onClick={() => selectPage?.(page)}
          className={`page-item ${currentPage === page ? "active" : ""}`}
        >
          <span className="page-link">{page}</span>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
