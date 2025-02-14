"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import { ForwardRefEditor } from "./_components/ForwardRefEditor";

import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/util/firebaseClient";
import { v4 as uuidv4 } from 'uuid'
import { FaRegTrashCan } from "react-icons/fa6";
import { CgMathPlus } from "react-icons/cg";
import { debounce } from "lodash";
import { createPost, getMenu, getPost,  updateCategory, updateMenu, updatePosts } from "@/api";



export const ClientPage = ({menus}:{menus:Menu[]}) => {
  const [menu, setMenu] = useState<Menu[]>([...menus]);
  const [currentMenu, setCurrentMenu] = useState<Menu>();





 const handleSaveMenu = useCallback(
   debounce(async (value) => {
     try {
        const newMenu = { ...currentMenu, name: value }
        if (currentMenu?.menuId) {
          updateCategory(currentMenu.menuId,currentMenu.id,newMenu)
        } else {
          updateMenu(currentMenu?.id, newMenu)
        }

       const fetchMenus = await getMenu()
       
        setMenu([...fetchMenus])
     } catch (error) {
      console.log(error);
     }
      // setTitle(value)
    }, 500), // 500ms 디바운스
    []
  );





  return (
    <div className="grid grid-cols-[15rem_1fr] h-full">
      <MemoizedSideBar
        menu={menu}
        setMenu={setMenu}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
      />
      {currentMenu && <MemoizedEditor currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
        handleSaveMenu={handleSaveMenu}
      />}
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

  const createMenu = async (menuId?: number) => {
    // 하위 카테고리에 새로운 메뉴 추가
    const id = uuidv4()
    let categorie = {
        id,
        name: '새 페이지',
        timeStamp: new Date().toISOString(),
        active:false,
      }
    // 최상위 메뉴에 새 메뉴 추가
    try {
    if (menuId) {
        const menuCopy = [...menu];
        const index = menuCopy.findIndex((item) => item.id === menuId);
        if (index >= 0) {
          const menuId = menuCopy[index].id
        // console.log(menuId);
        // console.log(id);
         categorie ={...categorie,menuId}
        await setDoc(doc(db,"menus",menuId,"categories",id),{...categorie})
           
        if (menuCopy[index]?.categories) {
        menuCopy[index].categories = [...menuCopy[index].categories,categorie]
        } else {
        menuCopy[index].categories = [categorie]
        }
        
        createPost(id)
        setMenu(menuCopy);
        setCurrentMenu(categorie)
        
        }
        
        return;
     
      }
      
   
    
      await setDoc(doc(db, "menus", id), categorie);
    
      createPost(id)
      
    setMenu((prev) => [...prev, { ...categorie }]);
    setCurrentMenu(categorie)
    } catch (error) {
      console.log(error);
      
    }
  };

  




  // 클릭한 메뉴를 currentMenu에 저장
  const onClickSelect = (item: Menu) => {
    setCurrentMenu(item);
  };

  const onClickRemoveMenu = async(menuId: number, categorieId?: number) => {
    if (categorieId) {
      const menuCopy = [...menu];
      const menuIndex = menuCopy.findIndex((item) => item.id === menuId);
      const categories = menuCopy[menuIndex].categories.filter(
        (item) => item.id !== categorieId
      );
      menuCopy[menuIndex].categories = [...categories];
      await deleteDoc(doc(db,'menus',menuId,'categories',categorieId))
      
      setMenu(menuCopy);
      return;
    }
    await deleteDoc(doc(db,'menus',menuId))

    setMenu((prev) => prev.filter((item) => item.id !== menuId));
    
  };


  




  return (
    <div className="flex flex-col border-r-[1px] border-solid border-gray-200 p-4 bg-gray-100">
      <div className="p-2 flex w-full justify-between items-center">
        <span>아트자석</span>
        <button
          className=" hover:bg-gray-200 p-2 gap-1 rounded-lg"
          onClick={() => createMenu()}
        >
          <CgMathPlus/>
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
                    className="hover:bg-gray-200 p-2 gap-1 rounded-lg"
                    onClick={() => onClickRemoveMenu(item.id)}
                  >
                    <FaRegTrashCan/>

                  </button>
                   <button
                    className="hover:bg-gray-200 p-2 gap-1 rounded-lg"
                    onClick={() => createMenu(item.id)}
                  >
                                       <CgMathPlus/>

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
                            className="hover:bg-gray-200 p-2 gap-1 rounded-lg"
                            onClick={() => onClickRemoveMenu(item.id, sub.id)}
                          >
                    <FaRegTrashCan/>
                          
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
const Editor = ({ currentMenu,setCurrentMenu,handleSaveMenu }: { currentMenu: Menu ,setCurrentMenu:Dispatch<SetStateAction<Menu>>}) => {
  const [post, setPost] = useState<{
    id:string,markdown:string
  }>({
    id: currentMenu.id,
    markdown:``
  });
  const editorRef = useRef(null);


 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
   setCurrentMenu(prev => ({ ...prev, name: value }))
   handleSaveMenu(value)
  };

  

  const callAPI = async () => {
    try {
      const newPost = await getPost(currentMenu.id as string)
      console.log(newPost);
      setPost(newPost)
    } catch (error) {
      console.log(error);
      
    }
  }
  
  const onClickUpdatePost = () => {
    try {
      
      updatePosts(post.id,{markdown:post.markdown})
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    if(!currentMenu) return
    callAPI()
    //setPost(newPost)
  },[currentMenu])


  return (
    <div className=" flex flex-col p-4 flex-1 gap-4 ">
      <div className=" flex justify-between">
        <input
          className=" text-4xl font-bold outline-none"
          value={currentMenu.name}
          onChange={handleChange}
          placeholder="새 페이지"
        />
        <div className=" h-full flex gap-2">
          <button
            onClick={onClickUpdatePost}
            className="h-full text-l  p-1 rounded-lg font-bold bg-blue-500 text-white">
          저장
        </button>
        <button className="h-full text-l  p-1 rounded-lg font-bold bg-red-500 text-white">
          삭제
        </button>
        <button className="h-full text-l  p-1 rounded-lg font-bold bg-gray-300 text-gray-700">
          게시
        </button>

        </div>
      
      </div>
      <div className=" overflow-auto h-[92vh] bg-gray-100">
        <ForwardRefEditor markdown={post.markdown} onChange={(markdown) => setPost(prev => ({...prev,markdown})) } ref={editorRef} />
      </div>
    </div>
  );
};

// memo로 감싸 최적화
const MemoizedEditor = memo(Editor);
