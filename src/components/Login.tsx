import { Link , useNavigate} from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import CatchError from "../lib/CatchError"


const Login = () => {
  const navigate = useNavigate()

 const login = async (values: FormDataType) =>{
  try{
    
     const { data } = await HttpInterceptor.post("/auth/login", values)
     if (data?.accessToken) {
       localStorage.setItem("accessToken", data.accessToken)
     }
     navigate("/app")
  }
  catch(err: unknown)
  {
    CatchError(err, "bottom-center" )
    
  }
 }
 
 
  return (
    <div className="bg-gray-100 flex lg:items-center items-end justify-center h-screen">
        <div className="lg:w-6/12 animate__animated animate__fadeIn">
          <Card noPadding>
            <div className="grid lg:grid-cols-2">
                <div className="p-8 space-y-6 lg:order-1 order-2">
                  <div>
                    <h1 className="text-xl font-bold text-black">SIGN In  </h1>
                    <p className="text-gray-500">Start your first chat now !</p>
                  </div>
                  <Form className="space-y-6" onValue={login}>
                
                    <Input 
                     name="email"
                     placeholder="Email id"
                    // value= "sohan@gmail.com"
                    />

                   <Input 
                     type="password"
                     name="password"
                     placeholder="Password"
                    // value="sohan@123"
                    />

                    <Button type="danger" icon="arrow-right-up-line">Sign in</Button>
                  </Form>
                  <div className="flex gap-2">
                    <p>Don't have an account ?</p>
                    <Link to="/signup" className="text-green-400 font-medium hover:underline">Sign up </Link>
                  </div>

                </div>
                <div className="lg:order-2 order-1 overflow-hidden h-[500px]  bg-linear-to-t from-sky-500 to-indigo-500  flex items-center justify-center rounded-r-xl">
                  <img src="/images/login.svg" alt="auth" className="lg:w-[70%] w-full lg:h-auto h-[180px] object-cover animate__animated animate__slideInUp animate__faster"/>

                </div>
            
            
           </div>
          </Card>
        </div>
    </div>
  )
}

export default Login
