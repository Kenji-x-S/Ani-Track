import React from "react";

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="py-8 lg:py-16">{children}</div>;
};

export default PageContainer;
