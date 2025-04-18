"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  memo,
} from "react";
import { ForwardRefEditor } from "./_components/ForwardRefEditor";

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
      <MemoizedSideBar
        menu={menu}
        setMenu={setMenu}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
      />
      {currentMenu && <MemoizedEditor currentMenu={currentMenu} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SideBar 컴포넌트 메모화
// ─────────────────────────────────────────────────────────────
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
    name: "새 페이지",
    categories: [],
  };

  const createMenu = (menuId?: number) => {
    // 하위 카테고리에 새로운 메뉴 추가
    if (menuId) {
      const menuCopy = [...menu];
      const index = menuCopy.findIndex((item) => item.id === menuId);
      if (index >= 0) {
        menuCopy[index].categories.push({
          ...DEFAULT_MENU,
          id: new Date().getTime(),
        });
        setMenu(menuCopy);
      }
      return;
    }
    // 최상위 메뉴에 새 메뉴 추가
    setMenu((prev) => [...prev, { ...DEFAULT_MENU, id: new Date().getTime() }]);
  };

  // 클릭한 메뉴를 currentMenu에 저장
  const onClickSelect = (item: Menu) => {
    setCurrentMenu(item);
  };

  const onClickRemoveMenu = (menuId: number, categorieId?: number) => {
    if (categorieId) {
      const menuCopy = [...menu];
      const menuIndex = menuCopy.findIndex((item) => item.id === menuId);
      const categories = menuCopy[menuIndex].categories.filter(
        (item) => item.id !== categorieId
      );
      menuCopy[menuIndex].categories = [...categories];
      setMenu(menuCopy);
      return;
    }
    setMenu((prev) => prev.filter((item) => item.id !== menuId));
  };

  useEffect(() => {
    console.log("menu: ", menu);
  }, [menu]);

  return (
    <div className="flex flex-col border-r-[1px] border-solid border-gray-200 p-4 bg-gray-100">
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
                  <button
                    className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg"
                    onClick={() => onClickRemoveMenu(item.id)}
                  >
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
                          <button
                            className="border-solid border-2 border-gray-300 p-1 gap-1 rounded-lg"
                            onClick={() => onClickRemoveMenu(item.id, sub.id)}
                          >
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

// memo로 감싸 최적화
const MemoizedSideBar = memo(SideBar);

// ─────────────────────────────────────────────────────────────
// Editor 컴포넌트 메모화
// ─────────────────────────────────────────────────────────────
const Editor = ({ currentMenu }: { currentMenu: Menu }) => {
  const [title, setTitle] = useState(currentMenu.name);
  const [markdown, setMarkdown] = useState(``);
  const editorRef = useRef(null);

  return (
    <div className=" flex flex-col p-4 flex-1 gap-4 ">
      <div>
        <input
          className="w-full text-4xl font-bold outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 페이지"
        />
      </div>
      <div className=" overflow-auto h-[92vh] bg-gray-100">
        <ForwardRefEditor markdown={markdown} onChange={setMarkdown} ref={editorRef} />
      </div>
    </div>
  );
};

// memo로 감싸 최적화
const MemoizedEditor = memo(Editor);
