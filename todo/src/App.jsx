import {useState} from 'react';
import Footer from "./component/Footer"

const App =() =>{
  const [tasks,setTasks] =useState([]);
  const [newTask,setNewTask] =useState("");
  const handleNewTask=(e)=>{
    if(e.target.value.trim() !== "")
    setNewTask(e.target.value)
  }
  const handleAddTask =() =>{
    setTasks([...tasks,newTask]);
    setNewTask("");
  } 
  const handleMoveTaskUp=(index)=>{
    if(index-1>=0){
    const updateTask=[...tasks];
    [updateTask[index],updateTask[index-1]]=[updateTask[index-1],updateTask[index]];
    setTasks(updateTask);
    }
  }
  const handleMoveTaskDown=(index)=>{
    if(index+1<tasks.length){
      const updateTask=[...tasks];
    [updateTask[index],updateTask[index+1]]=[updateTask[index+1],updateTask[index]];
    setTasks(updateTask);
    }
  }
  const handleDeleteTask=(index)=>{
    const updateTask=tasks.filter((_,ind)=> ind!==index
    )
    setTasks(updateTask);

  }
  return (
    <>
    <h1 className="text-3xl text-slate-600 italic text-center mt-15 mb-5">Todo List</h1>
    <div className="w-[90%] md:w-[80%] mx-auto flex justify-center items-center gap-3">
      
      <input type="text" value={newTask} onChange={handleNewTask} 
      className="w-[60%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter Todo Item "></input>
     <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer" onClick={handleAddTask}>
      Add item</button>
    </div>


    <div className="w-[90%] md:w-[80%] mx-auto mt-4 flex flex-col gap-2">
      {tasks.map((el,index)=>{
        return(
        <p className="flex flex-row gap-1 text-center" key={index}>
          <span className="bg-slate-200 rounded-md p-2 w-[60%] hover:bg-slate-300">{el}</span>
          <button className="bg-blue-300 rounded-md p-2 cursor-pointer" onClick={()=>handleMoveTaskUp(index)}>Priority</button>
          <button className="bg-blue-300 rounded-md p-2 cursor-pointer" onClick={()=>handleMoveTaskDown(index)}>Later</button>
          <button className="bg-red-300 rounded-md p-2 cursor-pointer" onClick={()=>handleDeleteTask(index)}>Delete</button>
        </p>
        )
      })}
    </div>

     <Footer/>
    </>
  )
}
export default App;