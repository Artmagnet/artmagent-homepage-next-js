import { getCompanyInfo, getMenu } from "@/api";
import PostFrame from "@/app/_components/frame/PostFrame";
import ClientPage from "./ClientPage";
import Footer from "@/app/_components/layout/Footer";

const Map = async () => {
  const menu = await getMenu();
  const info = await getCompanyInfo();

  return (
    <>
      <PostFrame menu={menu}>
        <ClientPage info={info} />
        <Footer info={info} />
      </PostFrame>
    </>
  );
};

export default Map;
