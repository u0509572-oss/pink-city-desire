import React from "react";

const InfoBox = ({ heading = "", data = "" }) => {
  return (
    <div className="p-5 border-2 border-white text-white">
      <div className="text-lg font-semibold mb-2">{heading}</div>
      <div className="text-sm">{data}</div>
    </div>
  );
};

export default InfoBox;
