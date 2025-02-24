"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  memo,
} from "react";
import classNames from "classnames";
import { ForwardRefEditor } from "./_components/ForwardRefEditor";

import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/util/firebaseClient";
import { v4 as uuidv4 } from "uuid";
import { FaRegTrashCan } from "react-icons/fa6";
import { CgMathPlus } from "react-icons/cg";
import { debounce } from "lodash";
import {
  createPost,
  deleteFiles,
  getMenu,
  getPost,
  updateCategory,
  updateMenu,
  updatePosts,
} from "@/api";

import styles from "./style.module.css";

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
      {currentMenu && (
        <MemoizedEditor
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          handleSaveMenu={handleSaveMenu}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SideBar 컴포넌트
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
  const createMenu = async (menuId?: string | number) => {
    const id = uuidv4();
    let newPage = {
      id,
      name: "새 페이지",
      timeStamp: new Date().toISOString(),
      active: false,
    };

    try {
      // (1) 하위 카테고리 생성
      if (menuId) {
        const menuCopy = [...menu];
        const index = menuCopy.findIndex((item) => item.id === menuId);
        if (index >= 0) {
          const parentId = menuCopy[index].id; // 상위 메뉴 id
          newPage = { ...newPage, menuId: parentId };

          // Firebase 저장
          await setDoc(doc(db, "menus", parentId, "categories", id), {
            ...newPage,
          });
          // 로컬 state 업데이트
          if (menuCopy[index]?.categories) {
            menuCopy[index].categories.push(newPage);
          } else {
            menuCopy[index].categories = [newPage];
          }
          // 문서(게시글)도 생성
          await createPost(id);
          setMenu(menuCopy);
          setCurrentMenu(newPage);
        }
        return;
      }

      // (2) 최상위 메뉴 생성
      await setDoc(doc(db, "menus", id), newPage);
      // 문서(게시글)도 생성
      await createPost(id);

      setMenu((prev) => [...prev, { ...newPage }]);
      setCurrentMenu(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // 클릭한 메뉴를 currentMenu에 저장
  const onClickSelect = (item: Menu) => {
    setCurrentMenu(item);
  };

  // 메뉴/카테고리 삭제
  const onClickRemoveMenu = async (menuId: string, categorieId?: string) => {
    try {
      if (categorieId) {
        // 하위 카테고리 삭제
        const menuCopy = [...menu];
        const menuIndex = menuCopy.findIndex((item) => item.id === menuId);
        if (menuIndex === -1) {return;}

        const filtered = menuCopy[menuIndex].categories?.filter(
          (item) => item.id !== categorieId
        );
        menuCopy[menuIndex].categories = filtered || [];

        await deleteDoc(doc(db, "menus", menuId, "categories", categorieId));
        setMenu(menuCopy);
        return;
      }

      // 최상위 메뉴 삭제
      await deleteDoc(doc(db, "menus", menuId));
      setMenu((prev) => prev.filter((item) => item.id !== menuId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarHeaderTitle}>아트자석</span>
        <button
          className={styles.sidebarHeaderButton}
          onClick={() => createMenu()}
        >
          <CgMathPlus />
        </button>
      </div>

      {menu.length > 0 ? (
        <>
          {menu.map((item) => (
            <div key={item.id} className={styles.menuWrapper}>
              {/* ─── 최상위 메뉴 ───────────────────────────── */}
              <div
                className={classNames(styles.menuButton, {
                  [styles.menuButtonActive]: currentMenu?.id === item.id,
                })}
                onClick={() => onClickSelect(item)}
              >
                <span>{item.name}</span>
                <div className="flex gap-2 items-center">
                  <button
                    className={styles.sidebarHeaderButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickRemoveMenu(item.id);
                    }}
                  >
                    <FaRegTrashCan />
                  </button>
                  <button
                    className={styles.sidebarHeaderButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      createMenu(item.id);
                    }}
                  >
                    <CgMathPlus />
                  </button>
                </div>
              </div>

              {/* ─── 하위 카테고리 ─────────────────────────── */}
              {item.categories?.length ? (
                <ul className={styles.subMenuList}>
                  {item.categories.map((sub) => (
                    <li key={sub.id}>
                      <div
                        className={classNames(styles.menuButton, {
                          [styles.menuButtonActive]: currentMenu?.id === sub.id,
                        })}
                        onClick={() => onClickSelect(sub)}
                      >
                        <span>{sub.name}</span>
                        <div className="flex gap-2 items-center">
                          <button
                            className={styles.sidebarHeaderButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickRemoveMenu(item.id, sub.id);
                            }}
                          >
                            <FaRegTrashCan />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </>
      ) : (
        <div className={styles.emptyMenu}>
          <span>메뉴를 만들어 주세요.</span>
        </div>
      )}
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
