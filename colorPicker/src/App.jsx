import {useState} from 'react';

import Footer from "./component/Footer"


const App =() =>{
  const [color,setColor] =useState("blue-100");

  const handleColorChange=(e)=>{
    setColor(e.target.value)
  }

  return (
    <>
    <div className="w-[90%] md:w-[80%] mx-auto">
      <h1 className="text-3xl font-bold text-slate-600 text-center mt-20" style={{ color:`#${color.slice(1,5)}b7`}}>Color-Picker</h1>
      <div className="w-50 h-50 rounded-full mx-auto m-5 border-4  " style={{ backgroundColor: `${color}` , borderColor:`#${color.slice(1,5)}b3`}}></div>
      <div className="mx-auto flex flex-col justify-center items-center gap-6">
        <label className="align-top">
        <input type="color" value={color} onChange={handleColorChange} className=" text-center w-30 inline-block px-2"/> 
        Select Color
        </label>
         <label>
        <input type="text" value={color} onChange={handleColorChange} className="mx-2 text-center border rounded-md "/> 
        input code
         </label>
      </div>

      <ul className="mt-10 text-center text-sm italic list-disc">
      <li className="">This take input and use Hooks to change the color of the box . </li>
      <li className="">Also the border changes color depending on the box color  </li>
      </ul>
      </div>

      <Footer/>
    </>
  )
}
export default App;