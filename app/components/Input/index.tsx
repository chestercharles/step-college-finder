type InputProps = {
  name: string;
  label: string;
  type?: string;
  error?: string;
};

export default function Input({
  name,
  label,
  type = "text",
  error = "",
}: InputProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
