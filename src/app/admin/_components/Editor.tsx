import { getPost, deleteFiles, updatePosts } from "@/api";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { ForwardRefEditor } from "./ForwardRefEditor";
import styles from "../style.module.css";
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
      const deleteFileNames = notUsedImages.map((item) =>
        extractFileName(item)
      );

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
    if (!currentMenu) {
      return;
    }
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

export default Editor;
