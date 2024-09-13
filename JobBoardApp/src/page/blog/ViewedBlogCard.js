import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Badge } from "reactstrap";
import { calculateReadingTime } from "../../utils/function/readingTime";
import moment from "moment";
export const ViewedBlogCard = (props) => {
  return (
    <motion.div
      className="mb-5 card-container col-lg-3 col-md-6 col-sm-12"
      whileHover={{
        y: -10,
      }}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="card h-100">
        <NavLink to={`/blog/${props.blog.slug}`}>
          <img
            src={props.blog.thumbnailUrl}
            alt={props.blog.title}
            className="rounded mb-4 card-img-top"
            style={{
              height: "auto",
              width: "100%",
            }}
          />
        </NavLink>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate-two title is-6">
            <NavLink to={`/blog/${props.blog.slug}`} className="text-black">
              {props.blog.title}
            </NavLink>
          </h6>
          <div>
            {props.blog.categories.slice(0, 3).map((item, index) => (
              <Badge
                key={item.id}
                color="primary"
                style={{
                  color: "white",
                  marginRight:
                    index !== props.blog.categories.length - 1 ? "10px" : "0px",
                }}
              >
                {item.name}
              </Badge>
            ))}
          </div>
          <div className="card-text mb-4 flex-grow-1 text-truncate-multiline">
            {props.blog.citation}
          </div>
          <div>
            {moment(props.blog.createdAt).format("MMMM DD, YYYY")}{" "}
            <span className="mx-2 slash">•</span>
            <span className="mx-2">
              {`${calculateReadingTime(props.blog.content)} min`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
