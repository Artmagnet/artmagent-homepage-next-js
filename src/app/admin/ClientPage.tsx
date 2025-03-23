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

import { debounce } from "lodash";
import {
  deleteFiles,
  getMenu,
  getPost,
  updateCategory,
  updateMenu,
  updatePosts,
} from "@/api";

import styles from "./style.module.css";
import SideBar from "./_components/Sidebar";
import Setting from "./_components/Setting";
import Editor from "./_components/Editor";

export const ClientPage = ({
  menus,
  info,
}: {
  menus: Menu[];
  info: any[0];
}) => {
  const [menu, setMenu] = useState<Menu[]>([...menus]);
  const [currentMenu, setCurrentMenu] = useState<Menu>();

  // 메뉴 이름 디바운스 업데이트
  const handleSaveMenu = debounce(async (value: string) => {
    try {
      const newMenu = { ...currentMenu, name: value };
      if (currentMenu?.menuId) {
        // 하위 카테고리 업데이트
        await updateCategory(currentMenu.menuId, currentMenu.id, newMenu);
      } else {
        // 최상위 메뉴 업데이트
        await updateMenu(currentMenu?.id, newMenu);
      }

      // 업데이트된 메뉴 다시 fetch
      const fetchMenus = await getMenu();
      setMenu([...fetchMenus]);
    } catch (error) {
      console.log(error);
    }
  }, 500);

  return (
    <div className={styles.gridContainer}>
      <MemoizedSideBar
        menu={menu}
        setMenu={setMenu}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
      />
      {currentMenu ? (
        <MemoizedEditor
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          handleSaveMenu={handleSaveMenu}
        />
      ) : (
        <Setting info={info} />
      )}
    </div>
  );
};

const MemoizedSideBar = memo(SideBar);

// ─────────────────────────────────────────────────────────────
// Editor 컴포넌트
// ─────────────────────────────────────────────────────────────

const MemoizedEditor = memo(Editor);
