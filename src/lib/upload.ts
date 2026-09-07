import axios from 'axios'
import HttpInterceptor from './HttpInterceptor'

/**
 * Uploads a file using presigned S3 URL, with fallback to backend direct upload proxy if CORS or network error occurs.
 */
export const uploadFileToStorage = async (file: File, path: string, status: string = 'public-read'): Promise<string> => {
  try {
    const payload = {
      path,
      type: file.type,
      status
    }
    const { data } = await HttpInterceptor.post('/storage/upload', payload)

    const options = {
      headers: {
        'Content-Type': file.type
      }
    }
    await axios.put(data.url, file, options)
    return path
  }
  catch (err) {
    console.warn("S3 presigned PUT upload failed/CORS blocked. Falling back to backend direct upload route...", err)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("path", path)
    formData.append("type", file.type)
    formData.append("status", status)

    await HttpInterceptor.post('/storage/upload-direct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return path
  }
}
