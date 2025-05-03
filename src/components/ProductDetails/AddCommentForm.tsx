import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addComment } from "../../redux/productSlice";

interface AddCommentFormProps {
    productId: string;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [comment, setComment] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (comment.trim()) {
            dispatch(addComment({ productId, comment }));
            setComment("");
        }
    };

    return (
        <div className="add-comment-form">
            <h4>Add Comment</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!comment.trim()}
                >
                    Add Comment
                </button>
            </form>
        </div>
    );
};

export default AddCommentForm;
