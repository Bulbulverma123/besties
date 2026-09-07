const env = import.meta.env
import { useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import { Card as AntCard, message, Skeleton } from 'antd'
import Divider from "../shared/Divider"
import Editor from "../shared/Editor"
import HttpInterceptor from "../../lib/HttpInterceptor"
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import CatchError from "../../lib/CatchError"
import moment from "moment"
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/Fetcher"

interface FIleDataInterFace {
  url: string
  file: File
}

const Post = () => {
  const { data, isLoading } = useSWR('/post', Fetcher)
  const [value, setValue] = useState('')
  const [fileData, setFileData] = useState<FIleDataInterFace | null>(null)

  const attachFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.click()

    input.onchange = () => {
      if (!input.files)
        return

      const file = input.files[0]
      input.remove()
      const url = URL.createObjectURL(file)
      setFileData({ url, file: file })
    }
  }

  const createPost = async () => {
    try {
      let path = null

      if (fileData) {
        const ext = fileData.file.name.split(".").pop()
        const filename = `${uuid()}.${ext}`
        path = `posts/${filename}`
        const payload = {
          path: path,
          status: 'public-read',
          type: fileData.file.type
        }
        const options = {
          headers: {
            'Content-Type': fileData.file.type
          }
        }
        const { data } = await HttpInterceptor.post('/storage/upload', payload)
        await axios.put(data.url, fileData.file, options)

      }

      const formData = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value
      }
      await HttpInterceptor.post("/post", formData)
      mutate('/post')
      message.success("Post created successfully")
      setFileData(null)
      setValue('')

    }
    catch (err: any) {
      CatchError(err)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-8">
        {
          value.length === 0 &&
          <h1 className="text-lg font-medium text-black">Write your post here</h1>
        }
        {
          value.length > 0 &&
          <AntCard>
            <div className="space-y-6">
              {
                fileData && fileData.file.type.startsWith("image/") &&
                <img src={fileData.url} className="rounded-lg object-cover w-full" />
              }
              {
                fileData && fileData.file.type.startsWith("video/") &&
                <video src={fileData.url} className="rounded-lg object-cover w-full" controls />
              }
              <div dangerouslySetInnerHTML={{ __html: value }} className="hard-reset" />
              <label className="text-gray-500">{moment().format('MMM DD, hh:mm A')}</label>
            </div>
          </AntCard>
        }

        <Editor
          value={value}
          onChange={setValue}
        />
        <div className="space-x-4">
          <Button type="danger" icon="attachment-line" onClick={attachFile}>Attach</Button>
          {
            fileData &&
            <Button type="warning" icon="loop-left-line" onClick={() => setFileData(null)}>Reset</Button>
          }
          <Button type="secondary" icon="arrow-right-line" onClick={createPost}>Post</Button>
        </div>
      </div>
      {
        isLoading &&
        <Skeleton active />
      }
      
      {
        data && data.map((item: any) => (
          <Card>
            <div className="space-y-4">
              {
              item.attachment && item.type.startsWith("image/") &&
                <img src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full" />
              }
              {
              item.attachment && item.type.startsWith("video/") &&
                <video src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full" controls />
              }
              <div dangerouslySetInnerHTML={{ __html:item.content}} className="hard-reset" />
              <div className="flex justify-between items-center">
                <label className="text-sm font-normal">{moment(item.createdAt).format('MMM DD YYYY, hh:mm A')}</label>
              </div>
              <Divider />
              <div className='space-x-4'>
                <Button icon="thumb-up-line" type="info">{item.like || 0}</Button>
                <Button icon="thumb-down-line" type="warning">{item.dislike || 0}</Button>
                <Button icon="chat-ai-line" type="danger">{item.comment ||0}</Button>
              </div>
            </div>
          </Card>
        ))
      }

    </div>
  )
}

export default Post

// import ReadPost from './post/ReadPost'

// const Post = () => {
//   return (
//     <ReadPost showActions />
//   )
// }

// export default Post
