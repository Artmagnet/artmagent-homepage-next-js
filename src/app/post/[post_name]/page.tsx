import { getMenu } from "@/api";
import PostFrame from "@/app/_components/frame/PostFrame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "아트자석-자석판촉물",
  description: "아트자석 자석 판촉물",
  
};
const Post =  async() => {
    const menu = await getMenu()

    return <PostFrame menu={menu}>post</PostFrame>
}

export default Post