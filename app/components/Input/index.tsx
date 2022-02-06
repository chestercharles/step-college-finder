type InputProps = {
  name: string;
  label: string;
  type?: string;
  error?: string;
  value?: any;
};

export default function Input({
  name,
  label,
  type = "text",
  error = "",
  value,
}: InputProps) {
  return (
    <div className="flex">
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} value={value} />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
