import { createPost } from "@/api";
import { db } from "@/util/firebaseClient";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect } from "react";
import { CgMathPlus } from "react-icons/cg";
import { FaRegTrashCan } from "react-icons/fa6";
import styles from "../style.module.css";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { IoSettingsOutline  } from "react-icons/io5";
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
      <SettingCard currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
      {menu.length > 0 && (
        <>
          {menu.map((item) => (
            <div key={item.id} className={styles.menuWrapper}>
              {/* ─── 최상위 메뉴 ───────────────────────────── */}
              <MenuCard
                onClickSelect={onClickSelect}
                onClickRemoveMenu={onClickRemoveMenu}
                createMenu={createMenu}
                currentMenu={currentMenu}
                menu={item} />
              {/* ─── 하위 카테고리 ─────────────────────────── */}
              {item.categories?.length ? (
                <ul className={styles.subMenuList}>
                  {item.categories.map((categorie) => (
                    <CategoryCard
                      key={categorie.id}
                      menu={item}
                      categorie={categorie}
                      currentMenu={currentMenu}
                      onClickSelect={onClickSelect}
                      onClickRemoveMenu={onClickRemoveMenu} />
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </>
      )}
    </div>
  );
};


export default SideBar;


const SettingCard = ({ currentMenu,setCurrentMenu }:{currentMenu:Menu,setCurrentMenu:Dispatch<SetStateAction<Menu | undefined>>}) => {
  return (
    <div
      className={
        classNames(styles.menuButton, {
          [styles.menuButtonActive]: currentMenu ===undefined? true:false,
        })}
      onClick={()=>setCurrentMenu(undefined)}
    >
      <span>설정</span>
      <div className="flex gap-2 items-center">
        <button
          className={styles.sidebarHeaderButton}
        >
          <IoSettingsOutline  />
        </button>
      </div>
    </div>
  );
};

const MenuCard = ({ onClickSelect, onClickRemoveMenu, menu,currentMenu,createMenu }: {
    onClickSelect: (menu: Menu) => void;
    onClickRemoveMenu: (menuId: string, categorieId?: string) => Promise<void>;
    createMenu: (menuId?: string) => void;
    currentMenu?: Menu;
    menu: Menu;
}) => {
  return (
    <div
      className={
        classNames(styles.menuButton, {
          [styles.menuButtonActive]: currentMenu?.id === menu.id,
        })}
      onClick={() => onClickSelect(menu)}
    >
      <span>{menu.name}</span>
      <div className="flex gap-2 items-center">
        <button
          className={styles.sidebarHeaderButton}
          onClick={(e) => {
            e.stopPropagation();
            onClickRemoveMenu(menu.id);
          }}
        >
          <FaRegTrashCan />
        </button>
        <button
          className={styles.sidebarHeaderButton}
          onClick={(e) => {
            e.stopPropagation();
            createMenu(menu.id);
          }}
        >
          <CgMathPlus />
        </button>
      </div>
    </div>);
};


const CategoryCard = ({
  onClickSelect,
  onClickRemoveMenu,
  menu,
  currentMenu,
  categorie,
}: {
  categorie: Menu;
  currentMenu?: Menu;
  menu?: Menu;
  onClickSelect: (menu: Menu) => void;
  onClickRemoveMenu: (menuId: string, categorieId?: string) => Promise<void>;
}) => {
  return (
    <li key={categorie.id}>
      <div
        className={classNames(styles.menuButton, {
          [styles.menuButtonActive]: currentMenu?.id === categorie.id,
        })}
        onClick={() => onClickSelect(categorie)}
      >
        <span>{categorie.name}</span>
        <div className="flex gap-2 items-center">
          <button
            className={styles.sidebarHeaderButton}
            onClick={(e) => {
              e.stopPropagation();
              onClickRemoveMenu(menu.id, categorie.id);
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
      </div>
    </li>);
};
