import Image from 'next/image'
import Greet from "../components/greet";
import Timer from "../components/timer";
import { ModeToggle } from "../components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col content-center">
      <header className="flex flex-row align-top justify-end p-4">
        <ModeToggle />
      </header>
      <div className="items-center font-mono flex-col flex">
        <Timer />
      </div>
    </main>
  );
}
