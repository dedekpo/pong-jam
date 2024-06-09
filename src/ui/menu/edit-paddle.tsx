import { useState } from "react";
import { PaddleIcon } from "../../assets/icons";
import { usePaddleStore } from "../../stores/game-store";

export default function EditPaddle() {
  const { setPlayerColor } = usePaddleStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);

  const colors = [
    "#d94c51",
    "#4547bf",
    "#edce02",
    "#bd34eb",
    "#53eb34",
    "#eb34b7",
  ];

  function handleEditOpen() {
    setIsEditing(!isEditing);
  }

  function handleSelectColor(color: string) {
    setPlayerColor(color);
    handleEditOpen();
  }

  return (
    <div className="absolute bottom-10 left-10 w-min bg-slate-100 border-2 rounded-lg shadow-2xl flex items-center pr-5">
      <button
        onClick={handleEditOpen}
        className="whitespace-nowrap w-[120px] h-[50px] flex items-center gap-2 justify-center"
      >
        <div className="size-10">
          <PaddleIcon />
        </div>
        <span>Edit</span>
      </button>
      {isEditing && (
        <div className="flex items-center gap-2 border-l-2 pl-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleSelectColor(color)}
              style={{ backgroundColor: color }}
              className="size-10 rounded-lg border-2"
            />
          ))}
        </div>
      )}
    </div>
  );
}
