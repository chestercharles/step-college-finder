type Options = {
  label: string;
  value: string;
};

type InputProps = {
  type: "checkbox" | "radio";
  label: string;
  name: string;
  error?: string;
  options: Options[];
};

export function MultiInput({
  type,
  name,
  label,
  options,
  error = "",
}: InputProps) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map((option) => (
        <p>
          <input
            type={type}
            id={option.value}
            name={name}
            value={option.value}
          />
          <label htmlFor={option.value}>{option.label}</label>
        </p>
      ))}
      {error && <div>{error}</div>}
    </fieldset>
  );
}
