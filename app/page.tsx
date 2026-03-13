
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientPage";
import Searchbar from "@/components/Searchbar"

export default async function Home({searchParams}: {searchParams: Promise<{
  search: string;page?: string
}>}) {

   const params = await searchParams;
  const page = Number(params?.page ?? "1");
  const search = params?.search ?? ""

    console.log("✅ page.tsx debug here   — page:", page, "search:", search); // debug
  return (
    <div className="w-full">
      <Navbar/>
      <Searchbar/>
      <PatientCard page={page} search={search}/>
    </div>
  );
}
