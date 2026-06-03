import {useState,useEffect} from 'react';
import Footer from "./component/Footer"

const App =() =>{
  const [time,setTime] =useState(new Date());

  useEffect(()=>{

    const timer=setInterval(()=>{
      setTime(new Date());
    },1000)

    return()=>{
      clearInterval(timer);
    }
  },[])

  const timeFunction =() =>{
    const hours =time.getHours();
    const minutes =time.getMinutes();
    const seconds =time.getSeconds();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const AmOrPm = hours >= 12 ? 'PM' : 'AM';

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${AmOrPm}`;
  }
  
  return(
      <>
      <div className="w-full h-screen flex flex-col items-center justify-center " id="clock-page">
        <p className="text-2xl text-slate-300 font-bold font-mono italic">{time.toDateString()}</p>
        <p className="text-5xl text-white font-bold font-mono  ">{timeFunction()}</p>
        </div>
        <Footer/>
      </>
  )
}
export default App;