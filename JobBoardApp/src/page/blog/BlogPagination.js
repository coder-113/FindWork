import { motion } from "framer-motion";

export function BlogPagination(props) {
  return (
    <div className="row pagination-wrap mt-5">
      <div className="col-md-12 text-center ">
        <div className="custom-pagination ml-auto">
          <a
            className={`prev ${props.currentPage === 0 ? "disabled" : ""}`}
            onClick={() => props.paginate(props.currentPage - 1)}
          >
            Prev
          </a>
          <div className="d-inline-block">
            {Array.from(
              {
                length: props.totalPages,
              },
              (_, i) => (
                <a
                  key={i}
                  className={`${props.currentPage === i ? "active" : ""}`}
                  onClick={() => props.paginate(i)}
                >
                  {i + 1}
                </a>
              )
            )}
          </div>
          <a
            className={`next ${
              props.currentPage === props.totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => props.paginate(props.currentPage + 1)}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
}
