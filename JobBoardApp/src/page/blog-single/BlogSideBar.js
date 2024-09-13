import { memo } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

export const BlogSideBar = memo((props) => {
  const categories = useSelector((state) => state.blogs.categories);
  const blogs = useSelector((state) => state.blogs.blogs);
  const author = useSelector((state) => state.blogs.author);
  const blog = useSelector((state) => state.blogs.blog);

  const currentBlogCategories = blog?.categories.map(
    (category) => category.name
  );

  // Lọc ra các bài blog có ít nhất một category giống với blog hiện tại
  const relatedBlogs = blogs
    .filter(
      (item) =>
        item.categories.some((cat) =>
          currentBlogCategories.includes(cat.name)
        ) && item.id !== blog.id
    )
    .slice(0, 5);

  return (
    <div className="col-lg-4 sidebar pl-lg-5">
      <div className="sidebar-box">
        <img
          src={author.imageUrl}
          alt="Image placeholder"
          className="img-fluid mb-4 w-100 rounded-circle"
        />
        <h4 className="title is-4">
          {author?.firstName} {author?.lastName}
        </h4>
        <p className="text-truncate-multiline">{author?.bio}</p>
      </div>
      <div className="sidebar-box">
        <div className="categories">
          <h3>Categories</h3>
          {categories.slice(0, 5).map((category) => (
            <li key={category.id}>
              <NavLink to={`/blogs?type=${category.name}`}>
                {category.name} <span>{category.blogCount}</span>
              </NavLink>
            </li>
          ))}
        </div>
      </div>
      <div className="sidebar-box">
        <div className="categories">
          <h3>Related article</h3>
          {relatedBlogs.map((blog) => (
            <li key={blog.id}>
              <NavLink to={`/blog/${blog.slug}`}>{blog.title}</NavLink>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
});
