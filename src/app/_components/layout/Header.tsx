"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Header = ({ menu,urlMenu }: {
    menu: Menu[],
    urlMenu:{menu?:Menu,category?:Menu}
 }) => {
  const [currentMenu, setCurrentMenu] = useState<Menu>(urlMenu?.menu);
  const [currentCategory, setCurrentCategory] = useState<Menu>(urlMenu?.category);
  const router = useRouter();

  const onClickMenu = (item: Menu) => {
    if (item.categories?.length > 0) {
      setCurrentMenu(item);
      return;
    }
    router.push(`/post/${item.name}?id=${item.id}`);
  };

  const onClickCategories = (item: Menu) => {
    router.push(`/post/${item.name}?id=${item.id}`);
  };


  return (
    <>
      <div className=" border-b border-solid border-b-gray-200   ">
        <div className="w-full flex gap-2 p-3 max-w-[1280px] m-auto">
          <div className="flex gap-2 items-center">
            {/* <SlArrowLeft className="cursor-pointer"/> */}
            <div className=" cursor-pointer flex flex-1 w-full  items-center gap-2">
              <span className="text-xl hover:underline  hover:underline-offset-8" onClick={() => router.push("/")}>홈</span>
              <span className="text-xl hover:underline  hover:underline-offset-8">둘러보기</span>
              {menu.map(item => <div key={item.id} onClick={() => onClickMenu(item)}><span className="text-xl hover:underline  hover:underline-offset-8">{item.name}</span></div>)}
            </div>
            {/* <SlArrowRight className="cursor-pointer"/>  */}
          </div>
        </div>
        {/* <h1 className=" cursor-pointer text-2xl" onClick={()=>router.push('/')}>아트자석</h1> */}


      </div>
      {currentMenu?.categories?.length >0 && <div className=" border-b border-solid border-b-gray-200 ">
        <div className="w-full p-3 flex gap-2 max-w-[1280px] m-auto " >
          {currentMenu?.categories?.map(item => (<button
            key={item.id}
            onClick={() => onClickCategories(item)}
            className="cursor-pointer" >
            <span className="text-lg hover:underline  hover:underline-offset-8" >{item.name}</span>
          </button>))}

        </div>

      </div>}


    </>

  );
};
export default Header;


