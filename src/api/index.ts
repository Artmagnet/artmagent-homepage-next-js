import { db } from "@/util/firebaseClient";
import { getDocs, collection } from "firebase/firestore";

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

    console.log("All menus with categories:", allCategories);
    return allCategories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
  }
}