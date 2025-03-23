import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseClient";

export const addCategory = async (name: string) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (e) {
    console.log(e);
  }
};
