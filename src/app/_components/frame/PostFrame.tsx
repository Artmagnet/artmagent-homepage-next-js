import { ReactNode } from "react";
import Header from "../layout/Header";

const PostFrame = ({ menu ,children,urlMenu }: {
    menu: Menu[]
    children?: ReactNode,
    urlMenu:{menu?:Menu,category?:Menu}
}) => {
  return (
    <div className="w-full flex flex-col flex-1 justify-center ">
      <div className="flex flex-col flex-1 w-full ">
        <Header menu={menu} urlMenu={urlMenu} />
        {children}
      </div>
    </div>

  );
};

export default PostFrame;
