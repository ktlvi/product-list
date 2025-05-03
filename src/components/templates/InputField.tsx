interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
}) => {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input
                type={type}
                name={name}
                className="form-control"
                value={value}
                onChange={onChange}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default InputField;
