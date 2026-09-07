import { Link, useNavigate} from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import CatchError from "../lib/CatchError"

const Signup = () => {
  const navigate = useNavigate()
  const signup= async(values:FormDataType) =>{
    try{
       await HttpInterceptor.post("/auth/signup", values)
       navigate("/login")
    }
    catch(err) 
    {
      CatchError(err)
    }
  }
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-[100dvh] py-8 px-4">
        <div className="w-full max-w-md lg:max-w-4xl animate__animated animate__fadeIn">
          <Card noPadding>
            <div className="grid lg:grid-cols-2">
                <div className="p-6 md:p-8 space-y-6 lg:order-1 order-2">
                  <div>
                    <h1 className="text-xl font-bold text-black">SIGN UP </h1>
                    <p className="text-gray-500">Start your first chat now !</p>
                  </div>
                  <Form className="space-y-6" onValue={signup}>
                    <Input 
                     name="fullname"
                     placeholder="Fullname"
                    />

                    <Input 
                     name="email"
                     placeholder="Email id"
                    />

                    <Input 
                     name="mobile"
                     placeholder="Mobile"
                    />

                    <Input 
                     type="password"
                     name="password"
                     placeholder="Password"
                    />

                    <Button type="danger" icon="arrow-right-up-line">Sign up</Button>
                  </Form>
                  <div className="flex gap-2 text-sm md:text-base">
                    <p>Already have an account ?</p>
                    <Link to="/login" className="text-green-500 font-medium hover:underline">Sign in </Link>
                  </div>

                </div>
                <div className="lg:order-2 order-1 overflow-hidden lg:h-[500px] h-[160px] bg-gradient-to-t from-sky-500 to-indigo-500 flex items-center justify-center rounded-t-xl lg:rounded-r-xl lg:rounded-tl-none">
                  <img src="/images/auth.svg" alt="auth" className="lg:w-[70%] w-3/4 lg:h-auto h-[140px] object-contain animate__animated animate__slideInUp animate__faster"/>

                </div>
            </div>
          </Card>
        </div>
    </div>
  )
}

export default Signup
