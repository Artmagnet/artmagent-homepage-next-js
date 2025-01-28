import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseClient";

export const addCategory = async  (name:string) => {
    try {
    console.log("카테고리 생성");
    
    const docRef = await addDoc(collection(db, "categories"), {
      name,
      createdAt: new Date(),
    });
    console.log(docRef);
    
    return docRef.id
  } catch (e) {
    console.log(e);
    
  }
}