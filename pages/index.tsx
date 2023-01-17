import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { HandRaisedIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <h1 className="text-3xl font-bold flex items-center">
      <HandRaisedIcon className="h-8 w-8" />
      Hello world!
    </h1>
  );
}
