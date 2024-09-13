import { useState } from "react";
import { FaPaperPlane, FaTimesCircle } from "react-icons/fa"; // Import FaTimesCircle for cancel icon
import "./CommentForm.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendNotificationAsync } from "../../services/NotificationService";

export const CommentForm = ({ blogId, parentId = null, addComment, user }) => {
  const [content, setContent] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();

  const blog = useSelector((state) => state.blogs.blog);

  const handleChange = (e) => {
    setContent(e.target.value);
    setIsEmpty(e.target.value.trim() === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const temporaryCommentId = `${Date.now()}`;

    const comment = {
      id: temporaryCommentId,
      blog: { id: blog.id, user: blog.user, slug: blog.slug },
      content,
      parent: parentId ? { id: parentId } : null,
      user: {
        username: user.sub,
      },
    };

    console.log(comment);
    addComment(comment);
    setContent("");
    setIsEmpty(true);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <textarea
          id="message"
          cols={30}
          rows={2}
          className="form-control"
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          required
          {...(parentId && { autoFocus: true })}
        />
        <button
          type={user && !isEmpty ? "submit" : "button"}
          className="post-button"
          {...(!user && {
            onClick: () => {
              navigate("/login");
            },
          })}
        >
          {user ? (
            isEmpty ? (
              <FaTimesCircle />
            ) : (
              <FaPaperPlane />
            )
          ) : (
            <span className="font-weight-bold">Sign in</span>
          )}
        </button>
      </div>
    </form>
  );
};
