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
    <p>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type={type}
        name={name}
        value={value}
        id="exampleInputEmail1"
        placeholder={placeholder}
      />
      {error && <div>{error}</div>}
    </p>
  );
}
