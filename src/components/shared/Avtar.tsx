import { FC, ReactNode } from "react"

interface AvtarInterface {
    title?: string | null
    subtitle?: ReactNode
    image?: string | null
    titleColor?: string
    subtitleColor?: string
    size?: "lg" | "md"
    key?: string | number
    onClick?: () => void
}

const Avtar: FC<AvtarInterface> = ({onClick, key=0, size="lg", title, subtitle ="Subtitle missing ", image ,titleColor="#000000", subtitleColor="#f5f5f5" }) =>{
    const avatarSrc = image || "/images/avtar.jpg"
    return (
       <div className="flex gap-3 items-center" key={key}>
            <div className="relative">
                <img
                    onClick={onClick}
                    src={avatarSrc}
                    className= {`${size === "lg"? "w-12 h-12" :"w-8 h-8"} rounded-full object-cover ${onClick ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
                 />
                {onClick && (
                    <div 
                      onClick={onClick}
                      className="absolute -bottom-1 -right-1 bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow cursor-pointer"
                      title="Edit Profile Photo"
                    >
                        <i className="ri-camera-line"></i>
                    </div>
                )}
            </div>
        
            {
                (title && subtitle) &&
                <div className="flex flex-col">
                    <h1 className={`${size === "lg"? "text-lg/6": "text-sm"} font-medium `} style={{color: titleColor}}>{title}</h1>
                 <div style={{color: subtitleColor}}>
                    {subtitle}
                    </div>
                </div>
            }
             
     </div>
    )
}

export default Avtar