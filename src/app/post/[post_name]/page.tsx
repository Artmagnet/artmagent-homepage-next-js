import { getMenu, getPost } from "@/api";
import PostFrame from "@/app/_components/frame/PostFrame";
import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "아트자석-자석판촉물",
  description: "아트자석 자석 판촉물",

};
const findItemWithMenuAndCategory = (items, targetName) => {
  for (const menu of items) {
    if (menu.name === targetName) {
      return { menu, category: undefined };
    }
    if (menu.categories && menu.categories.length > 0) {
      for (const category of menu.categories) {
        if (category.name === targetName) {
          return { menu, category };
        }
      }
    }
  }
  return null;
};

const Post =  async(props) => {
  const menu = await getMenu();
  const data = await props.params.post_name;
  const urlMenu=  findItemWithMenuAndCategory(menu,decodeURIComponent(data));
  console.log(urlMenu);
  const post = await getPost(urlMenu?.categories?.id ?? urlMenu?.menu.id);
  console.log(post);


  return <PostFrame menu={menu} urlMenu={urlMenu} >
    <ClientPage post={post} />
  </PostFrame>;
};

export default Post;

