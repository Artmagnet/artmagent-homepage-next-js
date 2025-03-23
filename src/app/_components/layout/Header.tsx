"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import style from "./style.module.css";
import classNames from "classnames";
import Image from "next/image";
import Logo from "../../../../public/logo_l.svg";
const Header = ({
  menu,
  urlMenu,
}: {
  menu: Menu[];
  urlMenu: { menu?: Menu; category?: Menu };
}) => {
  const [currentMenu, setCurrentMenu] = useState<Menu>(urlMenu?.menu);
  const [currentCategory, setCurrentCategory] = useState<Menu>(
    urlMenu?.category
  );
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
    <div className={style.container}>
      <div className={style.headerGroup}>
        <Image src={Logo} alt="logo_l" />
        <span className={style.menuText}>
          {currentCategory?.name ?? currentMenu?.name ?? "홈"}
        </span>
        <span className={style.menuText}>|</span>
        <div className={style.hadereBox}>
          <button>
            <SlArrowLeft className="cursor-pointer" />
          </button>
          <div className={style.hadereItem}>
            <span className={style.menuText} onClick={() => router.push("/")}>
              홈
            </span>
            {menu.map((item) => (
              <div key={item.id} onClick={() => onClickMenu(item)}>
                <span className={style.menuText}>{item.name}</span>
              </div>
            ))}
            <span
              className={style.menuText}
              onClick={() => router.push("/post/map")}
            >
              오시는길
            </span>
          </div>
          <button>
            <SlArrowRight className="cursor-pointer" />
          </button>
        </div>
      </div>
      {/* <h1 className=" cursor-pointer text-2xl" onClick={()=>router.push('/')}>아트자석</h1> */}

      {currentMenu?.categories?.length > 0 && (
        <div className={style.categorieGroup}>
          {currentMenu?.categories?.map((item) => (
            <button
              key={item.id}
              onClick={() => onClickCategories(item)}
              className="cursor-pointer"
            >
              <span className="text-lg hover:underline  hover:underline-offset-8">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default Header;
