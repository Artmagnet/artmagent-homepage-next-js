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

export interface Menu {
  id: string;
  name: string;
  menuId?: string | number;
  active?: boolean;
  categories?: Menu[];
  timeStamp?: string;
}

interface Post {
  id?: string;
  markdown: string;
  imagesURL: string[];
}

export const ClientPage = ({ menus }: { menus: Menu[] }) => {
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
      {currentMenu ?(
        <MemoizedEditor
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          handleSaveMenu={handleSaveMenu}
        />
      ):(<Setting/>)}
    </div>
  );
};



const MemoizedSideBar = memo(SideBar);



// ─────────────────────────────────────────────────────────────
// Editor 컴포넌트
// ─────────────────────────────────────────────────────────────
const Editor = ({
  currentMenu,
  setCurrentMenu,
  handleSaveMenu,
}: {
  currentMenu: Menu;
  setCurrentMenu: Dispatch<SetStateAction<Menu>>;
  handleSaveMenu: (value: string) => void;
}) => {
  const [isFetch, setIsFetch] = useState(false);
  const [post, setPost] = useState<Post>({
    id: currentMenu.id,
    markdown: "",
    imagesURL: [],
  });
  const editorRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 메뉴 이름 로컬 상태
    setCurrentMenu((prev) => ({ ...prev, name: value }));
    // 디바운스 업데이트
    handleSaveMenu(value);
  };

  const callAPI = async () => {
    try {
      setIsFetch(false);
      const newPost = await getPost(currentMenu.id as string);
      setPost(newPost);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetch(true);
    }
  };

  // 이미지 파일명 추출 함수
  const extractFileName = (fileUrl: string): string | null => {
    try {
      const decodedUrl = decodeURIComponent(fileUrl);
      const match = decodedUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch (error) {
      console.error("Error extracting file name:", error);
      return null;
    }
  };

  // 게시글 (Post) 업데이트
  const onClickUpdatePost = async () => {
    try {
      const urlRegex = /https?:\/\/[^\s)]+/g;
      // 마크다운 내 IMG URL 추출
      const extractedUrls = post.markdown.match(urlRegex) || [];
      const cleanedUrls = extractedUrls.map((url) => url.replace(/\\&/g, "&"));

      // 사용되지 않는 이미지를 서버에서 정리
      const notUsedImages = post.imagesURL.filter(
        (item) => cleanedUrls.indexOf(item) === -1
      );
      const deleteFileNames = notUsedImages.map((item) => extractFileName(item));

      if (deleteFileNames.length > 0) {
        await deleteFiles(deleteFileNames);
      }

      await updatePosts(post.id, {
        markdown: post.markdown,
        imagesURL: [...cleanedUrls],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentMenu) {return;}
    callAPI();
  }, [currentMenu]);

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <input
          className={styles.editorTitle}
          value={currentMenu.name}
          onChange={handleChange}
          placeholder="새 페이지"
        />
        <div className={styles.editorButtonsContainer}>
          <button onClick={onClickUpdatePost} className={styles.editorBtnSave}>
            저장
          </button>
          <button className={styles.editorBtnDelete}>삭제</button>
          <button className={styles.editorBtnPublish}>게시</button>
        </div>
      </div>
      <div className={styles.editorContent}>
        {isFetch && (
          <ForwardRefEditor
            markdown={post.markdown}
            onChange={(markdown) => setPost((prev) => ({ ...prev, markdown }))}
            ref={editorRef}
          />
        )}
      </div>
    </div>
  );
};

const MemoizedEditor = memo(Editor);
