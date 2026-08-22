import {useState ,useEffect ,useRef} from 'react';
import Footer from "./component/Footer"

const App =() =>{
  const [time,setTime]=useState();
  const [isRunning,setRunning]=useState(false);
  const [hours,setHours]=useState(0);
  const [minutes,setMinutes]=useState(0);
  const [seconds,setSeconds]=useState(0);
  let currentTime = useRef([0,0,0])
  const [isStopped,setStopped] = useState(false)


  useEffect(()=>{


     const timer = setInterval(()=>{
      const timeNow=new Date() ;
      setHours(timeNow.getHours()-time.getHours() + currentTime.current[0])
      setMinutes(timeNow.getMinutes()-time.getMinutes() + currentTime.current[1])
      setSeconds(timeNow.getSeconds()-time.getSeconds() + currentTime.current[2])
    } , 1000)


    if(isStopped){
      clearInterval(timer);
    }

    return ()=>{
      clearInterval(timer)
    }
  },[isRunning,isStopped ,time])
  
  const startHandler=()=>{
    if(isRunning){
      return
    }
    setTime(new Date());
    setRunning(true)
    setStopped(false)
  }

  const stopHandler=()=> {
    if(isStopped){
      return
    }
    currentTime.current = [hours,minutes,seconds];
    setStopped(true)
    setRunning(false)
   
  }


  const resetHandler = () => {
    if(!isRunning){
      return
    }
    setTime(0);
    setRunning(false);
     setHours(0)
    setMinutes(0)
    setSeconds(0)
    currentTime.current = [0,0,0];
  }
  return(
      <>
      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h1 className="text-3xl italics font-mono text-slate-400 font-bold my-2 text-center">Daily Planner and Timer</h1>
        <div className="w-[80%] mx-auto border border-slate-400 rounded-md py-3">
          <p className="text-2xl font-mono text-center ">{`${hours} : ${minutes} : ${seconds}`}</p>
          
          <p className="text-sm text-slate-500 text-center">{`${hours} Hours ${minutes} Minutes ${seconds} Seconds`}</p>
          <div className="flex flex-row gap-2 justify-center">
            <p className="bg-green-400 p-3 text-center rounded-md cursor-pointer hover:bg-green-500" onClick={startHandler}>Start</p>
            <p className="bg-slate-400 p-3 text-center rounded-md cursor-pointer hover:bg-slate-500" onClick={resetHandler}>Reset</p>
            <p className="bg-red-400 p-3 text-center rounded-md cursor-pointer hover:bg-red-500" onClick={stopHandler}>Stop</p>
          </div>
        </div>

      </div>     
     <Footer />
      </>
  )
}
export default App;