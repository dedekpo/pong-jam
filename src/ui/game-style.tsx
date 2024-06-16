export default function GameStyle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="h-full w-full overflow-hidden border-2 border-black rounded-[6px] shadow-[0_4px_black] ring-[3px] ring-inset ring-black ring-opacity-20">
        {children}
      </div>
    </div>
  );
}
