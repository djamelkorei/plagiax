import {useState} from "react";


export const useAuth = () => {

  const [auth,] = useState({
    name: 'John Doe',
    email: 'john.doe@gmail.com'
  })

  return {
    auth
  }
}
