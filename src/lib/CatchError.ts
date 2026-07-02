import axios from 'axios'
import {toast, ToastPosition} from "react-toastify"

const CatchError = (err: unknown, position: ToastPosition ="top-center") => {
    if(axios.isAxiosError(err))
       return toast.error(err.response?.data.message, {position})

    if(err instanceof Error)
      return toast.error(err.message, {position})

      return  toast.error("Network error", {position })
}

export default CatchError
