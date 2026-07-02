import { FC } from 'react'
import 'remixicon/fonts/remixicon.css'


const SmallButtonModel = {
    primary: "bg-blue-500 hover:bg-blue-600 rounded font-medium text-white px-3 py-1 text-sm",
    secondary: "bg-indigo-500 hover:bg-indigo-600 rounded font-medium text-white px-3 py-1 text-sm",
    danger: "bg-rose-500 hover:bg-rose-600 rounded font-medium text-white px-3 py-1 text-sm",
    warning: "bg-amber-500 hover:bg-amber-600 rounded font-medium text-white px-3 py-1 text-sm",
    dark: "bg-zinc-500 hover:bg-zinc-600 rounded font-medium text-white px-3 py-1 text-sm",
    success: "bg-green-400 hover:bg-green-500 rounded font-medium text-white px-3 py-1 text-sm",
    info: "bg-cyan-500 hover:bg-cyan-600 rounded font-medium text-white px-3 py-1 text-sm"
}

interface SmallButtonInterface {
    children?: string
    type?: "primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
    onClick?: ()=>void
    icon?: string
    key?: string | number
    loading?: boolean
}

const SmallButton: FC<SmallButtonInterface> = ({ key=0, children="Submit", type="primary", onClick, icon, loading= false})=>{
    if(loading)
    return (
        <button disabled className='text-gray-400 '>
            <i className='fa fa-spinner fa-spin mr-2'></i>
            Processing...
            </button>
    )

    return (
        <button  key={key} className={SmallButtonModel[type]} onClick={onClick}>
            {
                icon &&
                <i className={`ri-${icon} mr-1`}></i>
            }
            
            {children}
        </button>
    )
}

export default SmallButton