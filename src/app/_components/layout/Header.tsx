'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"

const Header = ({ menu }: { menu:Menu[] }) => {
        const [currentMenu,setCurrentMenu] = useState<Menu>()
        const router = useRouter()

        const onClickMenu = (item: Menu) => {
            console.log(item);
            
            router.push(`/post/${item.name}`)
        }


        return <div >
            <div className="w-full">
                <div className="w-full flex gap-2 p-5 ">
                    <h1 className=" cursor-pointer text-2xl" onClick={()=>router.push('/')}>아트자석</h1>
                    <div className="flex gap-2 items-end">
                        <SlArrowLeft className="cursor-pointer"/>
                        <div className=" cursor-pointer flex flex-1 w-full max-w-[1500px]">
                            {menu.map(item => <div key={item.id} onClick={() => setCurrentMenu(item)}><span>{item.name}</span></div>)}
                        </div>
                        <SlArrowRight className="cursor-pointer"/>
                    </div>
                 
                </div>
                <div className="flex gap-2 px-5">
                    {currentMenu?.categories?.map(item => (<button
                        key={item.id}
                        onClick={() => onClickMenu(item)}
                        className="cursor-pointer" >
                        <span >{item.name}</span>
                    </button>))}
                </div>
    
            </div>
        </div>
}
export default Header