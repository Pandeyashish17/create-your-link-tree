import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
const Loader = () => {
  return (
    <div className="grid min-h-screen place-content-center">
      <PacmanLoader color="#00acee" />
    </div>
  );
};

export default Loader;
