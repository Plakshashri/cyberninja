import { useState } from "react"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import PersonalityTest from "./components/PersonalityTest";
import Result from "./components/Result";
import Error from "./components/Error";
import Matches from "./components/Matches";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Mbti from "./components/Mbti";
const router = createBrowserRouter([
  {
    path: "/",
    element: <PersonalityTest />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/mbti",
    element: <Mbti />,
  },
  {
    path: "*",
    element: <Error />,
  },
  
]);
function App() {
  const [count, setCount] = useState(0)

  return (
    <RouterProvider router={router} />
  )
}

export default App
