import React from "react";
import { useNavigate } from "react-router";

const Matches = () => {
  const navigate = useNavigate()
  const handleclick = ()=>{
    navigate('/mbti')
  }
  return (
    <div>
      <h1
        style={{ fontFamily: "Dancing Script, cursive" }}
        className="text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539]"
      >
        Your Matches
      </h1>
      <button onClick={handleclick} className="px-5 py-2 bg-amber-200 rounded-[10px] fixed top-0 right-0 m-5 cursor-pointer">MBTI</button>
      <div className="flex items-center justify-center gap-10 mt-10 flex-wrap">
        <div className="h-[300px] w-[200px] bg-white flex flex-col items-center justify-center gap-4 shadow-xl/20 rounded-[10px]">
          <img className="h-[150px] w-[100px] rounded-[50%]" src="/girl1.jpg" alt="" />
          <h1>Suchita</h1>
          <p>ENTP</p>
          <p>Contact</p>
        </div>
        <div className="h-[300px] w-[200px] bg-white flex flex-col items-center justify-center gap-4 shadow-xl/20 rounded-[10px]">
          <img className="h-[150px] w-[100px] rounded-[50%]" src="/girl2.jpg" alt="" />
          <h1>Aastha</h1>
          <p>ENTP</p>
          <p>Contact</p>
        </div>
        <div className="h-[300px] w-[200px] bg-white flex flex-col items-center justify-center gap-4 shadow-xl/20 rounded-[10px]">
          <img className="h-[150px] w-[100px] rounded-[50%]" src="/girl3.jpg" alt="" />
          <h1>Sanvi</h1>
          <p>ENTP</p>
          <p>Contact</p>
        </div>
      </div>
    </div>
  );
};

export default Matches;
