export function Loader({ label = 'Loading...' }: { label?: string }) {
  return <div className="loader">{label}</div>
}
