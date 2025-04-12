import React from "react";
import { useLocation } from "react-router";
import {ReactTyped} from "react-typed"
import { useNavigate } from 'react-router';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, avg, name, gender } = location.state || {};
  const handlesubmit =()=>{
    navigate('/register')
  }
  return (
    <div className="max-w-screen p-10 h-[100vh]">
      <div className="flex flex-col max-w-[40vmax] m-auto shadow-xl/20 p-10 gap-30">
        <h1 className="text-3xl" style={{ fontFamily: "Dancing Script, cursive" }}>Result : {result}</h1>
        <h1 className="text-3xl" style={{ fontFamily: "Dancing Script, cursive" }}>Name : {name}</h1>
        <h1 className="text-3xl" style={{ fontFamily: "Dancing Script, cursive" }}>Gender : {gender}</h1>
      </div>
      <div className="max-w-[40vmax] m-auto pt-10 flex flex-col items-center">
        <h1 style={{ fontFamily: "Dancing Script, cursive" }} className="text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539] "><ReactTyped strings={["LOGIN TO SEE YOUR MATCH","FIND YOUR CONNECTION","UNRAVEL YOUR SOULMATE"]} typeSpeed={30} backSpeed={30} loop={true}
      /></h1>
        <button onClick={handlesubmit} className="bg-[#f66539] mt-[20px] px-10 py-2 rounded-4xl hover:border-white
        hover:bg-black hover:text-white hover:border-2  cursor-pointer transition-all duration-500 ease-in-out">Login</button>
      </div>
    </div>
  );
};

export default Result;