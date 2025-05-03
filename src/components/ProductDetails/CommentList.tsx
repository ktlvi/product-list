import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { deleteComment } from "../../redux/productSlice";
import { CommentProps } from "../../types";
import ConfirmationModal from "../templates/ConfirmationModal"; // Import the custom ConfirmationModal

interface CommentListProps {
    comments: CommentProps[];
    productId: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const handleDeleteComment = (): void => {
        if (commentToDelete) {
            dispatch(deleteComment({ productId, commentId: commentToDelete }));
            setCommentToDelete(null); // Close the modal after deletion
        }
    };

    const handleCancelDelete = (): void => {
        setCommentToDelete(null); // Close the modal without deleting
    };

    if (!comments || comments.length === 0) {
        return <p>No comments yet.</p>;
    }

    return (
        <div className="comment-list">
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-date">{comment.date}</span>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setCommentToDelete(comment.id)} // Open the confirmation modal
                        >
                            Delete
                        </button>
                    </div>
                    <p>{comment.description}</p>
                </div>
            ))}

            {commentToDelete && (
                <ConfirmationModal
                    title="Delete Comment"
                    message="Are you sure you want to delete this comment? This action cannot be undone."
                    onConfirm={handleDeleteComment}
                    onCancel={handleCancelDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
};

export default CommentList;
