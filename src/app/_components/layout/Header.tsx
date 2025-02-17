'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"

const Header = ({ menu }: { menu:Menu[] }) => {
        const [currentMenu,setCurrentMenu] = useState<Menu>()
        const router = useRouter()

        const onClickMenu = (item: Menu) => {
            if (item.categories?.length > 0) {
                setCurrentMenu(item)   
                return
            }
            router.push(`/post/${item.name}?id=${item.id}`)
        }
    
        const onClickCategories = (item: Menu) => {
            router.push(`/post/${item.name}?id=${item.id}`)
        }


        return <div >
            <div className="w-full border-b border-b-red-400 ">
                <div className="w-full flex gap-2 p-5 ">
                    {/* <h1 className=" cursor-pointer text-2xl" onClick={()=>router.push('/')}>아트자석</h1> */}
                    <div className="flex gap-2 items-center">
                        {/* <SlArrowLeft className="cursor-pointer"/> */}
                        <div className=" cursor-pointer flex flex-1 w-full max-w-[1500px] items-center gap-2">
                            <span className=" text-xl">홈</span>
                            <span className=" text-xl">둘러보기</span>
                            {menu.map(item => <div key={item.id} onClick={() => onClickMenu(item)}><span className=" text-xl">{item.name}</span></div>)}
                        </div>
                        {/* <SlArrowRight className="cursor-pointer"/> */}
                    </div>
                 
                </div>
                <div className="flex gap-2 px-5">
                    {currentMenu?.categories?.map(item => (<button
                        key={item.id}
                        onClick={() => onClickCategories(item)}
                        className="cursor-pointer" >
                        <span >{item.name}</span>
                    </button>))}
                </div>
    
            </div>
        </div>
}
export default Header