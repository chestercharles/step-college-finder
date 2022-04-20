type InputProps = {
  name: string;
  label: string;
  type?: string;
  error?: string;
  value?: any;
  placeholder?: string;
};

export function Input({
  name,
  label,
  type = "text",
  error = "",
  value,
  placeholder = "",
}: InputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        className="form-control"
        type={type}
        name={name}
        value={value}
        id="exampleInputEmail1"
        placeholder={placeholder}
      />
      {error && (
        <div id="emailHelp" className="form-text">
          {error}
        </div>
      )}
    </div>
  );
}
