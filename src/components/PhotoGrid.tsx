export default function PhotoGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-video rounded-md bg-slate-200" />
      ))}
    </div>
  );
}



