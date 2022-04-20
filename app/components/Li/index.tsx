export const Li: React.FC<
  React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
> = ({ ...props }) => {
  return <li className="list-group-item" {...props} />;
};
