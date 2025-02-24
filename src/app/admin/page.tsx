import { fetchAllCategories, getMenu } from "@/api";
import { ClientPage } from "./ClientPage";


export default async function Home() {



  // 사용 예시
  const menus =  await getMenu();




  return (
    <ClientPage menus={menus}/>
  );
}


