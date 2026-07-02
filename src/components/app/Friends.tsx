import useSWR, { mutate } from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/Fetcher"
import Error from "../shared/Error"
import { Skeleton } from "antd"
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/HttpInterceptor"

const Friends = () => {
  const {data, error, isLoading} = useSWR("/friend", Fetcher)
 console.log(data)
  if(isLoading)
    return <Skeleton active />

  if(error)
    return <Error message={error.message} />

const unfriend = async(id: string) =>{
 try{
    await HttpInterceptor.delete(`/friend/${id}`)
    mutate("/friend")
 }
 catch(err)
 {
     CatchError(err)
 }
}

  return (
    <div className="grid grid-cols-3 gap-8">
       {
            data.map((item: any, index: number)=>(
              <Card key={index}>
                <div className="flex flex-col items-center gap-3">
                  <img 
                    src={item.friend.image || "/images/avtar.jpg" }
                    className="w-16 h-16 rounded-full object-cover" 
                  />
                  <h1 className="text-base font-medium text-black capitalize">{item.friend.fullname}</h1>
                  {
                    item.status ==="accepted" ?
                    <button onClick={()=>unfriend(item._id)} className="bg-rose-500 text-white rounded px-2 py-1 text-xs hover:bg-rose-600 mt-1 font-medium">
                      <i className="ri-user-minus-line mr-1"></i>
                         UnFriend
                   </button>
                   :
                    <button className="bg-green-500 text-white rounded px-2 py-1 text-xs hover:bg-gray-400 mt-1 font-medium">
                      <i className="ri-check-double-line mr-1"></i>
                         request sent
                   </button>
                  }
                  
                </div>             
              </Card>
            ))
       }
       
    </div>
  )
}

export default Friends