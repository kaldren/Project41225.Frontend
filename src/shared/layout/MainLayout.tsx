import React, { PropsWithChildren } from "react";

const MainLayout: React.FunctionComponent<PropsWithChildren> = (props) => {
  return <>{props.children}</>;
};

export default MainLayout;
