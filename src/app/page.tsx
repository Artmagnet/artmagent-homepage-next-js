import { getCompanyInfo, getMenu } from "@/api";
import ClientPage from "./ClientPage";
import PostFrame from "./_components/frame/PostFrame";
import Footer from "./_components/layout/Footer";

export default async function Main() {
  const menu = await getMenu();
  const info = await getCompanyInfo();

  return (
    <PostFrame menu={menu}>
      <ClientPage />
      <Footer info={info} />
    </PostFrame>
  );
}
