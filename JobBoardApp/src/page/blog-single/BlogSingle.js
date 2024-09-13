import React, { useEffect, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlog,
  fetchAllCategories,
  fetchBlogById,
} from "../../features/blogSlice";
import {
  fetchAllCommentByBlogId,
  deleteComment,
  editComment,
  addComment,
} from "../../features/commentSlice";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BlogContent } from "./BlogContent";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import moment from "moment";
import { BlogTitle } from "./BlogTitle";
import ReadingBar from "./ReadingBar";
import { calculateReadingTime } from "../../utils/function/readingTime";
import { BlogSideBar } from "./BlogSideBar";
import "./style.css";
import axiosRequest from "../../configs/axiosConfig";
import { FaEye } from "react-icons/fa";

export const BlogSingle = () => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blog);
  const blogs = useSelector((state) => state.blogs.blogs);
  const comments = useSelector((state) => state.comments.comments);
  const categories = useSelector((state) => state.blogs.categories);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [readingTime, setReadingTime] = useState(0);
  const [readingCount, setReadingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchBlogById(id)).unwrap(),
          dispatch(fetchAllCommentByBlogId(id)).unwrap(),
          categories.length === 0 && dispatch(fetchAllCategories()).unwrap(),
          blogs.length === 0 && dispatch(fetchAllBlog()).unwrap(),
        ]);

        console.log("The data has been loaded successfully.");
      } catch (error) {
        console.log("Error loading data", "error");
      }
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (blog && blog.content) {
      setReadingTime(calculateReadingTime(blog.content));
      saveBlogToLocalStorage(blog);
    }
  }, [blog]);

  useEffect(() => {
    const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_ENDPOINT);
    const stompClient = new Client({
      webSocketFactory: () => socket,
    });

    const handleBeforeUnload = () => {
      axiosRequest.get(`/blogs/blog/${id}/leave`);
    };

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/blog/${id}`, (message) => {
        console.log(">>> message: ", message);
        if (message.body) {
          setReadingCount(JSON.parse(message.body));
        }
      });

      axiosRequest.get(`/blogs/blog/${id}`);

      window.addEventListener("beforeunload", handleBeforeUnload);
    };

    stompClient.activate();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stompClient.deactivate();
      handleBeforeUnload();
    };
  }, [id]);

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleEditComment = (commentId, updatedContent) => {
    dispatch(editComment({ commentId, updatedContent }));
  };

  const handleAddComment = (newComment) => {
    dispatch(addComment(newComment));
  };

  const saveBlogToLocalStorage = (blog) => {
    let viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];
    const isBlogAlreadyViewed = viewedBlogs.some(
      (viewedBlog) => viewedBlog.id === blog.id
    );

    if (!isBlogAlreadyViewed) {
      if (viewedBlogs.length >= 4) {
        viewedBlogs.shift(); // Remove the first item if the length is 4 or more
      }
      viewedBlogs.push(blog); // Add the new blog

      localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));
    }
  };

  return (
    <GlobalLayoutUser>
      {blog && (
        <>
          <section
            className="section-hero overlay inner-page bg-image"
            style={{
              backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
            }}
            id="home-section"
          >
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="custom-breadcrumbs mb-0">
                    <span className="slash">Posted by</span>{" "}
                    <span className="text-white">
                      {blog.user.firstName} {blog.user.lastName}
                    </span>
                    <span className="mx-2 slash">•</span>
                    {moment(blog.createdAt).format("MMMM Do YYYY")}
                    <span className="mx-2 slash">•</span>
                    <span className="text-white">{readingTime} min read</span>
                  </div>
                  <BlogTitle title={blog.title} />
                </div>
              </div>
            </div>
          </section>
          <section className="site-section" id="next-section">
            <ReadingBar />
            <div className="container">
              <div className="d-flex justify-content-between is-size-7">
                <p>
                  <FaEye /> There {readingCount > 1 ? "are" : "is"}{" "}
                  {readingCount} people reading with you.
                </p>
                <p>Updated {moment(blog.updatedAt).format("YYYY-MM-DD")}</p>
              </div>
              <div className="row">
                <div className="col-lg-8 blog-content">
                  <h3 className="mb-4 title is-4">{blog.title}</h3>
                  <p className="text-center">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                      }}
                      title={blog.title}
                    />
                  </p>
                  <i className="is-italic">{blog.citation}</i>
                  <hr />
                  <BlogContent content={blog.content} />
                  <hr />
                  <div>
                    <p>
                      Categories:
                      {blog.categories.slice(0, 3).map((item, index) => (
                        <React.Fragment key={item.id}>
                          <NavLink
                            to={`/blogs?type=${encodeURIComponent(item.name)}`}
                          >
                            <span
                              key={item.id}
                              color="primary"
                              className="text-white tag is-success"
                            >
                              {item.name}
                            </span>
                          </NavLink>
                          {index < blog.categories.length - 1 && " "}
                        </React.Fragment>
                      ))}
                    </p>
                    <p>
                      Tags:
                      {blog.hashtags.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <NavLink to={`/blogs?query=${item.name}`}>
                            <span className="text-white tag is-success">
                              #{item.name}
                            </span>
                          </NavLink>
                          {index < blog.hashtags.length - 1 && " "}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>

                <BlogSideBar />
                <div className="col-md-8">
                  <div className="pt-5">
                    {comments.length > 0 ? (
                      <>
                        <h4 className="mb-5 title is-4">
                          {comments.length} Comments
                        </h4>
                        <CommentList
                          comments={comments}
                          addComment={handleAddComment}
                          deleteComment={handleDeleteComment}
                          editComment={handleEditComment}
                          user={user}
                        />
                      </>
                    ) : (
                      <p className="is-size-6">No comments yet.</p>
                    )}
                    <CommentForm
                      blogId={id}
                      addComment={handleAddComment}
                      user={user}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </GlobalLayoutUser>
  );
};

export default BlogSingle;
