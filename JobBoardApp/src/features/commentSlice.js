import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCommentByBlogIdAsync,
  deleteCommentById,
  updateComment,
  postComment,
} from "../services/CommentService";

// Thunk để lấy tất cả comments theo blogId
export const fetchAllCommentByBlogId = createAsyncThunk(
  "comments/fetchByBlogId",
  async (id) => {
    const res = await fetchAllCommentByBlogIdAsync(id);
    return res;
  }
);

// Thunk để xóa comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      await deleteCommentById(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để cập nhật comment
export const editComment = createAsyncThunk(
  "comments/edit",
  async ({ commentId, updatedContent }, { rejectWithValue }) => {
    try {
      await updateComment(commentId, { content: updatedContent });
      return { commentId, updatedContent };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để thêm comment
export const addComment = createAsyncThunk(
  "comments/add",
  async (newComment, { rejectWithValue }) => {
    try {
      const res = await postComment(newComment);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
    // New state fields
    showReplies: {},
    showReplyForm: {},
    showEditForm: {},
    editedContent: {},
    originalContent: {},
  },
  reducers: {
    resetContent(state) {
      state.content = "";
    },
    // Add reducers for toggling form states and managing edited content
    toggleShowReplies(state, action) {
      const { commentId } = action.payload;
      state.showReplies[commentId] = !state.showReplies[commentId];
    },
    toggleShowReplyForm(state, action) {
      const { commentId } = action.payload;
      state.showReplyForm[commentId] = !state.showReplyForm[commentId];
    },
    toggleShowEditForm(state, action) {
      const { commentId, content } = action.payload;
      state.showEditForm[commentId] = !state.showEditForm[commentId];
      state.editedContent[commentId] = content;
      state.originalContent[commentId] = content;
    },
    setEditedContent(state, action) {
      const { commentId, content } = action.payload;
      state.editedContent[commentId] = content;
    },
    setOriginalContent(state, action) {
      const { commentId, content } = action.payload;
      state.originalContent[commentId] = content;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCommentByBlogId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCommentByBlogId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchAllCommentByBlogId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        const removeCommentFromTree = (comments, commentId) => {
          return comments
            .map((comment) => {
              if (comment.id === commentId) {
                return null;
              } else if (comment.children && comment.children.length > 0) {
                return {
                  ...comment,
                  children: removeCommentFromTree(comment.children, commentId),
                };
              }
              return comment;
            })
            .filter((comment) => comment !== null);
        };
        state.comments = removeCommentFromTree(state.comments, commentId);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const { commentId, updatedContent } = action.payload;
        const updateCommentInTree = (comments, commentId, updatedContent) => {
          const currentTime = new Date().toISOString();
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content: updatedContent,
                updatedAt: currentTime,
              };
            } else if (comment.children && comment.children.length > 0) {
              return {
                ...comment,
                children: updateCommentInTree(
                  comment.children,
                  commentId,
                  updatedContent
                ),
              };
            }
            return comment;
          });
        };
        state.comments = updateCommentInTree(
          state.comments,
          commentId,
          updatedContent
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = action.payload;
        console.log(">>newComment: ", newComment);

        const currentTime = new Date().toISOString();

        // Helper function to convert IDs to numbers
        const convertIdsToNumbers = (comments) => {
          return comments.map((comment) => {
            const newComment = {
              ...comment,
              id: Number(comment.id), // Ensure ID is a number
              children: comment.children
                ? convertIdsToNumbers(comment.children)
                : [],
            };
            return newComment;
          });
        };

        const addToTree = (comments, newComment) => {
          return comments.map((comment) => {
            // Convert comment id to number for comparison
            const commentId = Number(comment.id);
            const parentId = Number(newComment.parent?.id);

            if (commentId === parentId) {
              console.log("vao day!");
              return {
                ...comment,
                children: [...(comment.children || []), newComment],
              };
            } else if (comment.children && Array.isArray(comment.children)) {
              return {
                ...comment,
                children: addToTree(comment.children, newComment),
              };
            }
            return comment;
          });
        };

        // Convert IDs in state.comments to numbers
        const commentsWithNumbers = convertIdsToNumbers(state.comments);

        if (newComment.parent && newComment.parent.id) {
          state.comments = addToTree(commentsWithNumbers, {
            ...newComment,
            createdAt: currentTime,
            updatedAt: currentTime,
          });
        } else {
          state.comments.push({
            ...newComment,
            createdAt: currentTime,
            updatedAt: currentTime,
            children: [],
          });
        }
      })

      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  resetContent,
  toggleShowReplies,
  toggleShowReplyForm,
  toggleShowEditForm,
  setEditedContent,
  setOriginalContent,
} = commentSlice.actions;

export default commentSlice.reducer;
