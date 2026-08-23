const Items = (props) => {
  return (
    <>
      <div className="bg-blue-300 w-full h-auto p-5 rounded-md">
        <div
          className="flex flex-row justify-between"
          onClick={() => {
            return props.showClick(props.itemId);
          }}
        >
          <h1 className="text-2xl text-black font-bold ">{props.title}</h1>
          <p className="text-4xl">+</p>
        </div>

        {props.multi && props.multiArr.indexOf(props.itemId) > -1 ? (
          <p className="text-center font-sm text-gray-700">{props.content}</p>
        ) : (
          props.showId === props.itemId && (
            <p className="text-center font-sm text-gray-700">{props.content}</p>
          )
        )}
      </div>
    </>
  );
};

export default Items;
