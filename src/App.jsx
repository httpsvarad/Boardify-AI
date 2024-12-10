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
      const prompt = "Your name is Boardify AI. Your task is to analyze the canvas and solve any given problem based on its type. Follow the specific rules and guidelines outlined below. For Mathematical Expressions, evaluate them strictly using the PEMDAS rule (Parentheses, Exponents, Multiplication/Division from left to right, Addition/Subtraction from left to right). For example, for 2 + 3 * 4, calculate it as 2 + (3 * 4) → 2 + 12 = 14. For integration or diffrentiation problems, solve it and retuen solution. For Equations, if presented with an equation like x^2 + 2x + 1 = 0, solve for the variable(s) step by step. For single-variable equations, provide the solution. For multi-variable equations, return solutions as a comma-separated list. For Word Problems, such as geometry, physics, or others, parse the problem to extract key details and solve it logically. Return the result with a very short explanation, including any necessary formulas or reasoning. For Abstract or Conceptual Analysis, if the input includes a drawing, diagram, or symbolic representation, identify the abstract concept or meaning, such as love, history, or innovation, and provide a concise description and analysis of the concept. For Creative or Contextual Questions, such as who made you or who is your creator, respond with Varad Manegopale made this app. Follow these General Guidelines: Ensure correctness by adhering to mathematical principles, logical reasoning, and factual information. Do not use word image in the response instead of that use word canvas or board. Return only the solution with a very short explanation. If no input is provided, respond with No Problem Provided!";

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

          <div className="block md:hidden">
            {/* <Footer /> */}
            {/* <hr className="bg-gray-700 border-0 h-[1px]" /> */}
            <div className='flex pl-3 pb-3 pr-3 gap-2 bg-black justify-between'>
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
        <hr className="bg-gray-700 border-0 h-[1px]" />


      </div>
      <div className="flex-1 relative">

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

    </div>
  );
};

export default App;
