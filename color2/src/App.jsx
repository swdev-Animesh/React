import { useState } from "react";

const App = () => {
  const [bgState, setBgState] = useState("bg-gray-200");


  const rgbHandler = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setBgState(`rgb(${r}, ${g}, ${b})`);

  };

  const hexHandler = () => {
    const hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setBgState(hex);
  
  };

  const tailwindColorHandler = () => {
   // Clean, reliable base colors
const colors = [
  "blue",
  "indigo",
  "violet",
  "purple",
  "emerald",
  "teal",
  "cyan",
  "red",
  "amber",
  "slate"
];

// Rich, high-contrast shades (skips 50-200 light shades)
const shades = [500, 600, 700, 800];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomShade = (Math.floor(Math.random() * 8)+1) * 100;
    const randomColor = colors[randomIndex];
    console.log(randomColor);
  
    setBgState(`var(--color-${randomColor}-${randomShade}, ${randomColor})`);
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-3xl text-center text-slate-600">Welcome to Color2 App</h1>
      <br/>
      <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4 w-50"
        onClick={() => rgbHandler()}
      >
        Change Color RGB
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4 w-50"
        onClick={() => hexHandler()}
      >
        Change Color HEX
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-4 w-50"
        onClick={() => tailwindColorHandler()}
      >
        Tailwind Color
      </button>
      </div>
      </div>
      <div
        className={`w-full h-[90vh] flex justify-center items-center border my-5`}
        style={{ backgroundColor: bgState }}
      >
        <p className="text-2xl text-white">Current Color: {bgState}</p>
      </div>
    </>
  );
};

export default App;
