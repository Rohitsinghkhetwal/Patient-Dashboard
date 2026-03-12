
import Navbar from "@/components/Navbar";
import Searchbar from "@/components/Searchbar"
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar/>
      <Searchbar/>
    </div>
  );
}
