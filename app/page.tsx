
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientPage";
import Searchbar from "@/components/Searchbar"

export default async function Home({ searchParams }: {
  searchParams: Promise<{
    search: string; page?: string; sort_by?: string; sort_dir?: string
  }>
}) {

  const params = await searchParams;
  const page = Number(params?.page ?? "1");
  const search = params?.search ?? ""
  const sortBy = params?.sort_by ?? "patient_name";
  const sortDir = params?.sort_dir ?? "asc";
  return (
    <div className="w-full">
      <Navbar />
      <Searchbar />
      <PatientCard page={page} search={search} sortBy={sortBy} sortDir={sortDir} />
    </div>
  );
}
