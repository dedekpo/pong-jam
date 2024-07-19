import { useState } from "react";

export default function Tutorial() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);

  const options = [
    {
      img: "./assets/tutorial.gif",
      text: "Move the mouse to move the paddle",
    },
    {
      img: "./assets/power-up.gif",
      text: "Pick power-up for special effects",
    },
    {
      img: "./assets/hit-center.webp",
      text: "Hit in the center for more precision",
    },
    {
      img: "./assets/score.webp",
      text: "Score 7 points to win",
    },
  ];

  const handleNext = () => {
    if (step === 3) setOpen(false);
    setStep(step + 1);
  };

  if (!open) return null;

  return (
    <div className="absolute top-0 right-0 h-screen w-screen bg-black z-[999] bg-opacity-30 flex items-center justify-center">
      <div className="w-[600px] h-[440px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-1">Tutorial</h1>
        <p className="text-lg mb-2">{options[step].text}</p>
        <div className="border-2 border-black rounded-lg shadow-lg w-[70%] h-[60%] overflow-hidden">
          <img src={options[step].img} className="" alt="Tutorial" />
        </div>
        <button
          onClick={handleNext}
          className="border px-4 py-2 bg-red-400 rounded-md shadow-lg font-bold mt-2"
        >
          OK
        </button>
      </div>
    </div>
  );
}
