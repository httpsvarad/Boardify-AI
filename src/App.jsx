import React, { useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Eraser, Loader, Pencil, Undo } from 'lucide-react'


const apikey = import.meta.env.VITE_GEMINI_API_KEY;



const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const App = () => {

  const [strokesize, setStrokesize] = useState(2)
  const [strokecolor, setStrokecolor] = useState('#FFF')
  const [resp, setResp] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  let canvasDraw = null;  // To store CanvasDraw instance


  // Convert canvas to Base64
  const handleSaveAsBase64 = async () => {
    // Get Base64 image from CanvasDraw instance using getDataURL
    try {

      setIsLoading(true);

      const base64Image = canvasDraw.getDataURL("image/png");

      // Call Gemini API to process the image and get a response
      const imagePart = fileToGenerativePart(base64Image, "image/png");

      // Prompt for generating content
      const prompt = "Your job is to analyze the mathematical content and solve everything according to the rules.\n\nFor Mathematical Expressions:\nFollow the PEMDAS rule (Parentheses, Exponents, Multiplication/Division from left to right, Addition/Subtraction from left to right).\nFor example, for 2 + 3 * 4, calculate it as 2 + (3 * 4) → 2 + 12 = 14.\n\nFor Equations:\nIf given an equation like x^2 + 2x + 1 = 0, solve for the variable (x) or any variable in equation and return the result.\nIf multiple variables are involved, return them in a comma-separated\n\nIf the problem involves a graphical or word-based question (such as geometry, trigonometry, or physics), solve it as required and return the result.\n\nFor Abstract Concept Identification:\nIf there is a drawing or problem representing an abstract concept (like love, hate, or history), analyze it and return the concept description with its abstract concept result.\n\nGeneral Guidelines:\nSolve everything in the provided image or input.\nEnsure correctness by following mathematical rules and logical reasoning.\nReturn only answer with very short explanation.\nif there is nothing (only in case of blank) provided simply say no problem provivded.\nin case if the image contains questions like who made you or who is your creator? then reply Varad Manegopale made this app."
        ;

      // Send the prompt and image to Gemini
      const result = await model.generateContent([prompt, imagePart]);

      // Log the response from Gemini
      // console.log(result.response.text());
      setResp(result.response.text());
      setIsLoading(false);

    } catch (error) {
      console.log(error)
    }
  };

  // Helper function to prepare the image data
  function fileToGenerativePart(base64Image, mimeType) {
    return {
      inlineData: {
        data: base64Image.split(',')[1], // Strip out the base64 prefix
        mimeType,
      },
    };
  }

  return (

    <div className="h-screen flex flex-col overflow-hidden">
      <div className="absolute p-[10px] md:bottom-5 bottom-20 z-10 text-white">
        {resp}
      </div>
      <div>

        <div >

          <div className='flex p-3 bg-black gap-2 justify-between'>
            <h2 className='text-2xl font-bold text-white my-auto'>Boardify AI</h2>
            <div className='flex gap-3'>
              <div className='my-auto hidden md:block'>
                <div className='flex gap-3'>
                  <span className='my-auto text-white'>{strokesize}</span><input onChange={(e) => setStrokesize(e.target.value)} type="range" min={1} max="15" value={strokesize} className="range my-auto bg-gray-700 range-primary" />
                </div>

              </div>

              <div className='flex gap-3'>
                <button onClick={() => setStrokecolor('#FFF')} className="btn btn-primary"><Pencil /></button>
                <button onClick={() => setStrokecolor('#000')} className="btn btn-primary"><Eraser /></button>
                <button onClick={() => canvasDraw.undo()} className="btn btn-primary"><Undo /></button>
              </div>

              <div className='hidden md:block'>
                <div className='flex gap-3'>
                  <button onClick={handleSaveAsBase64} className="btn btn-success">{isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Calculate"}</button>
                  <button onClick={() => {
                    canvasDraw.clear()
                    setResp("")
                  }} className="btn btn-error">Reset</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <hr className="bg-gray-700 border-0 h-[1px]" />


      </div>
      <div className="flex-1 h-auto overflow-hidden relative">

        <CanvasDraw
          hideGrid={true}
          brushColor={strokecolor}
          brushRadius={strokesize}
          lazyRadius={0}
          style={{
            backgroundColor: "#000",
            height: "100%",
            width: "100%",
          }}
          ref={(canvas) => (canvasDraw = canvas)}

        />

        {/* <button onClick={handleSaveAsBase64} style={{ position: "absolute", zIndex: 20, backgroundColor:'#FFF', color: "black", padding: "10px", marginTop: "20px" }}>
        Send to Gemini
      </button> */}

      </div>
      <div className="block md:hidden">
        {/* <Footer /> */}
        <hr className="bg-gray-700 border-0 h-[1px]" />
        <div className='flex p-3 gap-2 bg-black justify-between'>
          <div className='my-auto flex gap-3'>
            <span className='my-auto text-white'>{strokesize}</span><input onChange={(e) => setStrokesize(e.target.value)} type="range" min={1} max="15" value={strokesize} className="range my-auto bg-gray-700 range-primary" />

          </div>
          <div className='flex gap-3'>
            <button onClick={handleSaveAsBase64} className="btn btn-success">{isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Calculate"}</button>
            <button onClick={() => {
              canvasDraw.clear()
              setResp("")
            }} className="btn btn-error">Reset</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
