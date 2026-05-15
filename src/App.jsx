import { Outlet } from 'react-router';
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;



