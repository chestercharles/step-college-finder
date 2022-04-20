import { ButtonHTMLAttributes } from "react";

export const Button: React.FC<
  React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ ...props }) => {
  return (
    <button className="btn btn-primary" style={{ padding: "8px" }} {...props} />
  );
};
