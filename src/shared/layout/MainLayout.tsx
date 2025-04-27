import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router";

const MainLayout: React.FunctionComponent<PropsWithChildren> = (props) => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default MainLayout;
