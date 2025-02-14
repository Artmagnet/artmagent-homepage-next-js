import { db } from "@/util/firebaseClient";
import { getDocs, collection, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";

/**메뉴 가져오기 */
export async function getMenu() {
  try {
    const menusSnapshot = await getDocs(collection(db, "menus"));

    const allCategories = await Promise.all(
      menusSnapshot.docs.map(async (menuDoc) => {
        const categoriesRef = collection(db, "menus", menuDoc.id, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);

        const categories = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          id: menuDoc.id,
          ...menuDoc.data(),
          categories,
        };
      })
    );

    return allCategories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
  }
}

/**메뉴 업데이트 */
export async function updateMenu(menuId:string, updatedData:object) {
  try {
    console.log(menuId,updatedData);
    
      const menuRef = doc(db, "menus", menuId);
      await updateDoc(menuRef, updatedData);
    

  } catch (error) {
    console.log(error);
    
  }
}

/** 카테고리 업데이트 */
export async function updateCategory(menuId:string, categoryId:string, updatedData:object) {
  try {
    const categoryRef = doc(db, "menus", menuId, "categories", categoryId);
    await updateDoc(categoryRef, updatedData);
    console.log(`카테고리 (${categoryId})가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("카테고리 업데이트 중 오류 발생:", error);
  }
}

export async function createPost(postId: string) {
  const postRef = doc(db, 'posts', postId)
  await setDoc(postRef,{markdown:``})
}


export async function getPost(postId: string) {
  try {
    const postDocRef = doc(db, "posts", postId); // 특정 문서 참조
    const postDocSnap = await getDoc(postDocRef); // 문서 가져오기

    if (postDocSnap.exists()) {
      return { id: postDocSnap.id, ...postDocSnap.data() };
    } else {
      console.log("해당 문서가 존재하지 않습니다.");
      return null;
    }
  } catch (error) {
    console.log("Error fetching post:", error);
    return null;
  }
}
export async function updatePosts(postId: string, updatedData: object) {
  try {
     console.log(postId,updatedData);
  
  const postRef = doc(db, 'posts', postId)
   await updateDoc(postRef, updatedData);
  } catch (error) {
    console.log(error);
    
  }
 
  
}