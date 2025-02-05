import { db } from "@/util/firebaseClient";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";

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