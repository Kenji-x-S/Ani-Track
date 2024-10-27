import React from "react";

const Error = ({ error }: { error: any }) => {
  return <p className="text-xs text-destructive mt-1">{error}</p>;
};

export default Error;
