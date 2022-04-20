import React from "react";

export const Container: React.FC = ({ children }) => {
  return (
    <>
      <nav style={{ display: "block", backgroundColor: "#0047ba" }}>
        <img
          style={{
            height: "50px",
            padding: "10px",
          }}
          src="https://images.squarespace-cdn.com/content/v1/58011bd8b8a79b4fae44a25f/1476481360094-DIV6WT7GN7TQNN3GLIJ2/logo.png?format=1500w"
        />
      </nav>
      <div className="container container-fluid" style={{ padding: "8px" }}>
        {children}
      </div>
    </>
  );
};
