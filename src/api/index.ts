import { db, storage } from "@/util/firebaseClient";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

/**세팅 가져오기 */
export async function getCompanyInfo(): Promise<any> {
  try {
    const infoSnapshot = await getDocs(collection(db, "info"));
    const doc = infoSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return doc[0];
  } catch (error) {
    console.log(error);
  }
}

/** 세팅 업데이트 */
export async function updateCompanyInfo(
  infoId: string,
  updatedData: CompanyInfo
) {
  try {
    const menuRef = doc(db, "info", infoId);
    await updateDoc(menuRef, updatedData);
  } catch (error) {
    console.log(error);
  }
}

/**메뉴 가져오기 */
export async function getMenu(): Promise<any> {
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
export async function updateMenu(menuId: string, updatedData: object) {
  try {
    console.log(menuId, updatedData);

    const menuRef = doc(db, "menus", menuId);
    await updateDoc(menuRef, updatedData);
  } catch (error) {
    console.log(error);
  }
}

/** 카테고리 업데이트 */
export async function updateCategory(
  menuId: string,
  categoryId: string,
  updatedData: object
) {
  try {
    const categoryRef = doc(db, "menus", menuId, "categories", categoryId);
    await updateDoc(categoryRef, updatedData);
    console.log(`카테고리 (${categoryId})가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("카테고리 업데이트 중 오류 발생:", error);
  }
}

export async function createPost(postId: string) {
  const postRef = doc(db, "posts", postId);
  await setDoc(postRef, { markdown: `` });
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
    console.log(postId, updatedData);

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, updatedData);
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  if (!file) return;

  const storageRef = ref(storage, `images/${file.name}`); // 파일 경로 설정 (images 폴더 안에 저장)

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // 업로드 진행 상황 관찰 (옵션)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // ...
      },
      (error) => {
        // 업로드 에러 처리
        reject(error);
      },
      () => {
        // 업로드 성공 후 다운로드 URL 가져오기
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

export async function deleteFile(fileName: string) {
  if (!fileName) return;

  const fileRef = ref(storage, `images/${fileName}`); // 삭제할 파일의 경로 설정

  return new Promise<void>((resolve, reject) => {
    deleteObject(fileRef)
      .then(() => {
        console.log(`File ${fileName} deleted successfully`);
        resolve();
      })
      .catch((error) => {
        console.error(`Error deleting file ${fileName}:`, error);
        reject(error);
      });
  });
}

export async function deleteFiles(fileNames: string[]) {
  if (!fileNames || fileNames.length === 0) return;

  const deletePromises = fileNames.map((fileName) => {
    const fileRef = ref(storage, `${fileName}`);
    return deleteObject(fileRef)
      .then(() => {
        console.log(`File ${fileName} deleted successfully`);
      })
      .catch((error) => {
        console.error(`Error deleting file ${fileName}:`, error);
      });
  });

  return Promise.all(deletePromises)
    .then(() => {
      console.log("All files deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting some files:", error);
    });
}
