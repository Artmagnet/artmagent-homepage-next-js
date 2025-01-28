import { ClientPage } from "./ClientPage";
import { db } from "@/util/firebaseClient";
import { getDocs, collection } from "firebase/firestore";



export default async function Home() {

async function fetchAllCategories() {
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

// 사용 예시
const menus =  await fetchAllCategories();

  

  
  return (
    <ClientPage menus={menus}/>
  );
}


