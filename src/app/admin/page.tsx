import { fetchAllCategories, getCompanyInfo, getMenu } from "@/api";
import { ClientPage } from "./ClientPage";
import Footer from "../_components/layout/Footer";

export default async function Home() {
  // 사용 예시
  const menus = await getMenu();
  const info = await getCompanyInfo();

  return (
    <>
      <ClientPage menus={menus} info={info} />;
      <Footer info={info} />
    </>
  );
}
