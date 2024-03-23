import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen bg-black text-white flex-col items-center items-center justify-center p-24 ${inter.className}`}
    >
      <Link href={"/generate"}>
      <button className="bg-blue-900 transition-all hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
        Go to generate Page
      </button>
      </Link>
    </main>
  );
}
