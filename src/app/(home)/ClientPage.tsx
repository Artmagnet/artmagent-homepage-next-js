"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Menu {
  name: string;
  categories: Menu[];
  id?: number;
}



export const ClientPage = () => {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [currentMenu, setCurrentMenu] = useState<Menu>();

  return (
    <div className="grid grid-cols-[15rem_1fr] h-full">
      <SideBar
        menu={menu}
        setMenu={setMenu}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
      />
      {currentMenu && <div>
        <Editor />
      </div>}
    </div>
  );
};

const SideBar = ({
  menu,
  setMenu,
  currentMenu,
  setCurrentMenu,
}: {
  menu: Menu[];
  setMenu: Dispatch<SetStateAction<Menu[]>>;
  currentMenu: Menu | undefined;
  setCurrentMenu: Dispatch<SetStateAction<Menu | undefined>>;
}) => {

  const DEFAULT_MENU: Menu = {
    name: "새페이지",
    categories: [],
  };

  const createMenu = (menuId?: number) => {
    console.log(menuId);
    
    // 하위 카테고리에 새로운 메뉴 추가
    if (menuId) {
      const menuCopy = [...menu];
      console.log('menuCopy',menuCopy);
      
      const index = menuCopy.findIndex((item) => item.id === menuId);
      // 만약 해당 menuId가 존재한다면(= index >= 0)
      if (index >= 0) {
        // 하위 카테고리에 새 메뉴 생성
        menuCopy[index].categories.push({
          ...DEFAULT_MENU,
          id: new Date().getTime(), // 임시로 Date.now() 사용
        });
        setMenu(menuCopy);
      }
      return;
    }

    // 최상위 메뉴에 새 메뉴 추가
    setMenu((prev) => [
      ...prev,
      { ...DEFAULT_MENU, id: new Date().getTime() },
    ]);
  };

  // 클릭한 메뉴를 currentMenu에 저장
  const onClickSelect = (item: Menu) => {
    setCurrentMenu(item);
  };

  const onClickRemoveMenu = (menuId:number,categorieId?:number) =>{
    
    if(categorieId){
      console.log(categorieId);
      
      const menuCopy = [...menu]
      const menuIndex= menuCopy.findIndex(item => item.id === menuId)
      const  categories =menuCopy[menuIndex].categories.filter(item => item.id !== categorieId)
      menuCopy[menuIndex].categories = [...categories]
      setMenu(menuCopy)
      
      return
    }

    setMenu(prev => prev.filter(item => item.id !== menuId))

    

  }

  useEffect(()=>{
    console.log(menu);
    
  },[menu])

  return (
    <div className="flex flex-col border-solid border-2 border-indigo-600 p-4">
      <div className="p-2 flex w-full justify-between items-center">
        <span>아트자석</span>
        <button
          className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg"
          onClick={() => createMenu()}
        >
          추가
        </button>
      </div>

      {/* 메뉴가 존재할 때 */}
      {menu.length > 0 ? (
        <>
          {menu.map((item) => (
            <div key={item.id} className="flex flex-col">
              {/* 최상위 메뉴 */}
              <div
                className={`
                  cursor-pointer
                  border-gray-200
                  p-2 flex justify-between items-center
                  hover:bg-gray-100
                  rounded-lg
                  ${
                    currentMenu?.id === item.id
                      ? "bg-gray-200" // 선택된 메뉴일 때 색상
                      : ""
                  }
                `}
                onClick={() => onClickSelect(item)}
              >
                <span>{item.name}</span>
                <div className="flex gap-2 items-center">
                  <button
                    className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg"
                    onClick={() => createMenu(item.id)}
                  >
                    추가
                  </button>
                  <button className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg" onClick={()=>onClickRemoveMenu(item.id)}>
                    삭제
                  </button>
                </div>
              </div>

              {/* 하위 카테고리가 있을 때 */}
              {item.categories?.length > 0 && (
                <ul className="flex flex-col pl-3">
                  {item.categories.map((sub) => (
                    <li key={sub.id}>
                      <div
                        className={`
                          cursor-pointer
                          border-gray-200
                          p-2 flex justify-between items-center
                          hover:bg-gray-100
                          rounded-lg
                          ${
                            currentMenu?.id === sub.id
                              ? "bg-gray-200" // 선택된 서브 메뉴일 때 색상
                              : ""
                          }
                        `}
                        onClick={() => onClickSelect(sub)}
                      >
                        <span>{sub.name}</span>
                        <div className="flex gap-2 items-center">
                          <button className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg"  onClick={()=>onClickRemoveMenu(item.id,sub.id)}>
                            삭제
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="flex items-center justify-center">
          <span>메뉴를 만들어 주세요.</span>
        </div>
      )}
    </div>
  );
};

const Editor = () => {


  return (
  <div className=" grid grid-cols-[15rem_1fr_25rem] h-full">
    <div className="flex flex-col p-4 border-2 border-solid border-gray-200 h-full">
      <div className="flex flex-col gap-2">
        <span>카테고리 이름</span>
       <input className="h-11 p-2 border-solid border-2 border-gray-200 rounded-lg"/>
      </div>
     
    </div>
    <div className="max-w-[1080px]  w-full h-full p-4 ">
      sdds
    </div>
    <div className="flex flex-col p-4 border-2 border-solid border-gray-200 h-full">
      sdds
    </div>
  </div>);
};
