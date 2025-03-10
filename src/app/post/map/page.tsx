import { getMenu } from "@/api";
import PostFrame from "@/app/_components/frame/PostFrame";
import ClientPage from "./ClientPage";

const Map = async () => {
  const menu = await getMenu();
  return (
    <>

      <PostFrame menu={menu}>
        <ClientPage />
      </PostFrame>
    </>

  );

};

export default Map;
