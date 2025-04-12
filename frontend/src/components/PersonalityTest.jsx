import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {motion} from "motion/react"
const questions = [
  { id: 1, trait: "O", text: "I enjoy trying new activities." },
  { id: 2, trait: "O", text: "I am curious about different things." },
  { id: 3, trait: "C", text: "I like to plan ahead." },
  { id: 4, trait: "C", text: "I am very organized." },
  { id: 5, trait: "E", text: "I love socializing." },
  { id: 6, trait: "E", text: "I talk a lot in groups." },
  { id: 7, trait: "A", text: "I am friendly and kind." },
  { id: 8, trait: "A", text: "I care about others." },
];

function PersonalityTest() {
  const animation1 = {
    hidden :{
      opacity : 0,
      x : -100,
    },
    show : {
      opacity : 1 , x : 1,
      transition:{
        duration : 3,
      },
    },
  };
  const animation2 = {
    hidden :{
      opacity : 0,
      x : 100,
    },
    show : {
      opacity : 1 , x : 1,
      transition:{
        duration : 3,
      },
    },
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const traits = { O: 0, C: 0, E: 0, A: 0 };
    const count = { O: 0, C: 0, E: 0, A: 0 };

    questions.forEach((q) => {
      const val = parseInt(data["q" + q.id]);
      traits[q.trait] += val;
      count[q.trait]++;
    });

    const avg = {
      O: traits.O / count.O,
      C: traits.C / count.C,
      E: traits.E / count.E,
      A: traits.A / count.A,
    };

    const result =
      (avg.O < 3 ? "I" : "E") +
      (avg.C < 3 ? "N" : "S") +
      (avg.E < 3 ? "T" : "F") +
      (avg.A < 3 ? "J" : "P");

    navigate("/result", {
      state: {
        result,
        avg,
        name: data.name,
        gender: data.gender,
      },
    });
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div initial="hidden" animate="show" variants={animation1} className="w-[30vw] h-full fixed left-0 top-0 pointer-events-none hidden md:block">
        <img 
          src="/img1.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={animation2}  className="w-[30vw] h-full fixed right-0 top-0 pointer-events-none hidden md:block">
        <img 
          src="/img2.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-2xl mx-auto">
        <h2
          style={{ fontFamily: "Dancing Script, cursive" }}
          className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 font-bold text-center mb-6"
        >
          Soulmate
        </h2>

        {questions.map((q) => {
          const qName = "q" + q.id;

          return (
            <div key={q.id} className="space-y-4">
              <p className="text-center font-medium m-[25px]">{q.text}</p>

              <div className="flex justify-between max-w-md mx-auto text-lg text-gray-600">
                <span className="text-red-500">Disagree</span>
                <span className="text-green-500">Agree</span>
              </div>

              <div className="flex justify-between max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map((val) => {
                  const border =
                    val <= 2
                      ? "border-red-500"
                      : val === 3
                      ? "border-gray-400"
                      : "border-green-500";

                  const bg =
                    val === 1
                      ? "peer-checked:bg-red-500"
                      : val === 5
                      ? "peer-checked:bg-green-500"
                      : "";

                  return (
                    <label key={val} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        value={val}
                        {...register(qName, { required: true })}
                        className="peer hidden"
                      />
                      <div
                        className={`w-7 h-7 rounded-full border-2 ${border} ${bg} peer-checked:border-4`}
                      ></div>
                    </label>
                  );
                })}
              </div>
              {errors[qName] && (
                <p className="text-center text-red-500 text-sm">
                  This question is required.
                </p>
              )}
            </div>
          );
        })}

        <div className="max-w-md mx-auto space-y-4 pt-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full border p-2 rounded"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm text-center">
              {errors.name.message}
            </p>
          )}

          <div className="flex gap-4 items-center justify-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Male"
                {...register("gender", { required: true })}
              />
              Male
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Female"
                {...register("gender", { required: true })}
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <p className="text-center text-red-500 text-sm">
              Please select your gender.
            </p>
          )}
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-[10px] transition-all duration-500 ease-in-out cursor-pointer hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalityTest;