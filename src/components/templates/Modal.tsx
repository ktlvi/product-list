interface ModalTemplateProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitText?: string;
    cancelText?: string;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
    title,
    children,
    onClose,
    onSubmit,
    submitText = "Submit",
    cancelText = "Cancel",
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTemplate;
