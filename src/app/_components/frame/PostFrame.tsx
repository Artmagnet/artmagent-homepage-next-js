import { ReactNode } from "react"
import Header from "../layout/Header"

const PostFrame = ({ menu ,children}: {
    menu: Menu[]
    children?:ReactNode,
}) => {
    return (
        <div className="w-full flex flex-col flex-1 justify-center max-w-[1920px] m-auto">
            <div className="flex flex-col flex-1 w-full max-w-[1280px] m-auto">
            <Header  menu={menu} />
            {children}
            </div>
          
        </div>

    )
}

export default PostFrame