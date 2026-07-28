// const env = import.meta.env
// import Button from "../../shared/Button"
// import Card from "../../shared/Card"
// import {Skeleton} from 'antd'
// import Divider from "../../shared/Divider"
// import moment from "moment"
// import useSWR, { mutate } from "swr"
// import Fetcher from "../../../lib/Fetcher"
// import IconButton from "../../shared/IconButton"
// import { FC } from "react"
// import CatchError from "../../../lib/CatchError"
// import HttpInterceptor from "../../../lib/HttpInterceptor"

// interface ReadPostInterface {
//   showActions?: boolean
// }

// const ReadPost: FC<ReadPostInterface> = ({showActions = false}) => {
//   const {data, isLoading} = useSWR('/post', Fetcher)

//   const deletePost = async (id: string)=>{
//     try {
//       await HttpInterceptor.delete(`/post/${id}`)
//       mutate('/post')
//     }
//     catch(err)
//     {
//       console.log(err)
//       CatchError(err)
//     }
//   }

//   return (
//     <div className="space-y-8">
//       {
//         isLoading &&
//         <Skeleton active />
//       }
//       {
//        data && data.map((item: any)=>(
//           <Card>
//             <div className="space-y-3">
//               {
//                 item.attachment && item.type.startsWith("image/") &&
//                 <img src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full" />
//               }
//               {
//                 item.attachment && item.type.startsWith("video/") &&
//                 <video src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full" controls />
//               }

//               <div dangerouslySetInnerHTML={{__html: item.content}} className="hard-reset" />
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-normal">{moment(item.createdAt).format('MMM DD YYYY, hh:mm A')}</label>
//                 {
//                   showActions &&
//                   <div className="flex gap-3">
//                     <IconButton type="success" icon="edit-line" />
//                     <IconButton type="danger" icon="delete-bin-line" onClick={()=>deletePost(item._id)} />
//                 </div>
//                 }
//               </div>
//               <Divider />
//               <div className="space-x-4">
//                 <Button icon="thumb-up-line" type="info">{item.like || 0}</Button>
//                 <Button icon="thumb-down-line" type="warning">{item.dislike || 0}</Button>
//                 <Button icon="chat-ai-line" type="danger">{item.comment || 0}</Button>
//               </div>
//             </div>
//           </Card>
//         ))
//       } 
//     </div>
//   )
// }

// export default ReadPost