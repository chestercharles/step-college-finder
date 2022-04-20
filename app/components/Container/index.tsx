import React from "react";

export const Container: React.FC = ({ children }) => {
  return (
    <div className="container container-fluid" style={{ padding: "8px" }}>
      {children}
    </div>
  );
};
