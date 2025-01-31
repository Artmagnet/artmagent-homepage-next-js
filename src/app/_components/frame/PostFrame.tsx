import { ReactNode } from "react"
import Header from "../layout/header"

const PostFrame = ({ menu ,children}: {
    menu: Menu[]
    children?:ReactNode,
}) => {
    return (
        <div className="w-full flex flex-col flex-1 justify-center max-w-[1920px] m-auto">
            <Header  menu={menu} />
            {children}
        </div>

    )
}

export default PostFrame