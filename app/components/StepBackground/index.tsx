export const StepBackground: React.FC = (props) => {
  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.squarespace-cdn.com/content/v1/58011bd8b8a79b4fae44a25f/1476746678960-EZFAJILSTM7VHYQFPA7F/home-hero.jpg?format=1000w')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >
      {props.children}
    </div>
  );
};
