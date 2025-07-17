import PromptPanel from "./components/PromptPanel";
import ScanPanel from "./components/ScanPanel";
import { TiwhanawhanaProvider } from "./components/TiwhanawhanaProvider";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 p-10 flex flex-col gap-8 items-center justify-center">
      <TiwhanawhanaProvider>
        <PromptPanel />
        <ScanPanel />
      </TiwhanawhanaProvider>
    </div>
  );
}
