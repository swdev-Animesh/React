import accordionData from "./data";

import Items from "./component/Items";

import { useState } from "react";

function App() {
  const [selected, setSelected] = useState(null);
  const [showMulti,setShowMulti] = useState(false);
  const [openList,setOpenList] = useState([])


 
  const handleOnClick = (itemId) => {
    if(showMulti){
      const cpyOpenList = [...openList]
      const ind = cpyOpenList.indexOf(itemId);
      if(ind>-1){
        cpyOpenList.splice(ind,1);
      }else{
        cpyOpenList.push(itemId);
      }
       setOpenList([...cpyOpenList]);

    }else{
    setSelected((prev) => {
      if (prev === itemId) {
        return null;
      } else {
        return itemId;
      }
    });
  }
    // console.log("clicked here" , selected)
  };

  const showHandler =() => {
    setShowMulti((prev)=>!prev);
    setSelected(null);
  }
  // console.log(selected,"this line")
  return (
    <>
      <div className="w-[80%] mx-auto flex flex-col justify-center items-center gap-5 my-10">
        <p className={`text-4xl font-bold text-black text-center text-grey-600 p-3 rounded-md ${showMulti ? "bg-green-400" : "bg-yellow-400"}`} onClick={showHandler}>{showMulti ? "Single Show" :"Multiple Shows"}</p>
        {accordionData.map((d) => (
          <Items
            title={d.title}
            content={d.content}
            key={d.id}
            itemId={d.id}
            showId={selected}
            multi={showMulti}
            multiArr={openList}
            showClick={handleOnClick}
          />
        ))}
      </div>
    </>
  );
}
export default App;
