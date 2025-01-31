import { getMenu } from "@/api";
import ClientPage from "./ClientPage";
import PostFrame from "./_components/frame/PostFrame";

export default async function Main() {
    const menu =  await getMenu();
    

    return (
        <PostFrame menu={menu} >
            <ClientPage />
        </PostFrame>
    )
    
    
}
