// import { useState } from "react"
// import Button from "../../shared/Button"
// import {Card as AntCard, message} from 'antd'
// import Editor from "../../shared/Editor"
// import HttpInterceptor from "../../../lib/HttpInterceptor"
// import {v4 as uuid} from 'uuid'
// import CatchError from "../../../lib/CatchError"
// import moment from "moment"
// import { mutate } from "swr"

// interface FileDataInterface {
//   url: string
//   file: File
// }


// const WritePost = () => {
//    const [value, setValue] = useState('')
//   const [fileData, setFileData] = useState<FileDataInterface | null>(null)

//   const attachFile = ()=>{
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "image/*,video/*"
//     input.click()

//     input.onchange = ()=>{
//       if(!input.files)
//         return

//       const file = input.files[0]
//       input.remove()
//       const url = URL.createObjectURL(file)
//       setFileData({url, file: file})
//     }
//   }

//   const createPost = async ()=>{
//     try {
//       let path = null

//       if(fileData)
//       {
//         const ext = fileData.file.name.split(".").pop()
//         const filename = `${uuid()}.${ext}`
//         path = `posts/${filename}`

//         const payload = {
//           path: path,
//           status: 'public-read',
//           type: fileData.file.type
//         }
//         const options = {
//           headers: {
//             'Content-Type': fileData.file.type
//           }
//         }
//         const {data} = await HttpInterceptor.post('/storage/upload', payload)
//         await HttpInterceptor.put(data.url, fileData.file, options)
//       }

//       const formData = {
//         attachment: path,
//         type: path ? fileData?.file.type : null,
//         content: value
//       }
//       await HttpInterceptor.post("/post", formData)
//       mutate('/post')
//       message.success("Post created successfully")
//       setFileData(null)
//       setValue('')
//     }
//     catch(err)
//     {
//       CatchError(err)
//     }
//   }

//   return (
//     <div className="flex flex-col gap-8">
//         {
//           value.length === 0 &&
//           <h1 className="text-lg font-medium text-black">Write your post here</h1>
//         }
//         {
//           value.length > 0 &&
//           <AntCard>
//             <div className="space-y-6">
//               {
//                 fileData && fileData.file.type.startsWith("image/") &&
//                 <img src={fileData.url} className="rounded-lg object-cover w-full" />
//               }
//               {
//                 fileData && fileData.file.type.startsWith("video/") &&
//                 <video src={fileData.url} className="rounded-lg object-cover w-full" controls />
//               }
//               <div dangerouslySetInnerHTML={{__html: value}} className="hard-reset" />
//               <label className="text-gray-500">{moment().format('MMM DD, hh:mm A')}</label>
//             </div>
//           </AntCard>
//         }
//         <Editor 
//           value={value}
//           onChange={setValue}
//         />
//         <div className="space-x-4">
//           <Button type="danger" icon="attachment-line" onClick={attachFile}>Attach</Button>
//           {
//             fileData &&
//             <Button type="warning" icon="loop-left-line" onClick={()=>setFileData(null)}>Reset</Button>
//           }
//           <Button type="secondary" icon="arrow-right-line" onClick={createPost}>Post</Button>
//         </div>
//       </div>
//   )
// }

// export default WritePost