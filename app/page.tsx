import Image from 'next/image'
import Greet from "../components/greet";
import Timer from "../components/timer";
import { ModeToggle } from "../components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col content-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-col flex">
        <ModeToggle />
        <Greet />
        <Timer />
      </div>
    </main>
  );
}
