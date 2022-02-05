type InputProps = {
  name: string;
  label: string;
  type?: string;
  error?: string;
  value: any;
};

export default function RadioInput({
  name,
  label,
  type = "text",
  error = "",
  value,
}: InputProps) {
  return (
    <div className="thing">
      <input type={type} name={name} value={value} />
      <label style={{ width: "300px", margin: "10px" }} htmlFor={name}>
        {label}
      </label>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
