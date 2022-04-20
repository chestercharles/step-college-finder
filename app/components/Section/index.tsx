export const Section: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ ...props }) => {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <section className="col" {...props} />
      </div>
    </div>
  );
};
