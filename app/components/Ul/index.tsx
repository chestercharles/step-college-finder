export const Ul: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >
> = ({ ...props }) => {
  return <ul className="list-group" {...props} />;
};
