export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(40%,40%,40%,0.9),transparent_200%)]" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] bg-repeat bg-[length:250px_250px] opacity-10" />
    </div>
  );
}