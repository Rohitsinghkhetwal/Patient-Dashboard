import { Patient } from "@/lib/Types/types";
import Image from "next/image";
import { MapPin } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PatientsResponse {
  data: Patient[];
  meta: Meta;
}

async function fetchPatients(page = 1, search = ""): Promise<PatientsResponse> {
  const params = new URLSearchParams({page: String(page), limit: "12", search: search})
  console.log("SEARCH INSIDE PATIENTPAGE:", search)
  if(search) params.set("search", search)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/patients?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Maps a medical issue string to a pill color style
function getIssueStyle(issue: string): string {
  const map: Record<string, string> = {
    fever:           "bg-red-100 text-red-600 border border-red-300",
    headache:        "bg-orange-100 text-orange-600 border border-orange-300",
    "sore throat":   "bg-yellow-100 text-yellow-600 border border-yellow-300",
    "sprained ankle":"bg-green-100 text-green-600 border border-green-300",
    rash:            "bg-pink-100 text-pink-600 border border-pink-300",
    sinusitis:       "bg-amber-100 text-amber-700 border border-amber-300",
    "ear infection": "bg-teal-100 text-teal-600 border border-teal-300",
  };
  return map[issue?.toLowerCase()] ?? "bg-gray-100 text-gray-600 border border-gray-300";
}

export default async function PatientsPage({
  page=1,
  search= "",
}: {
  page?:number;
  search?: string;
}) {
//   const page = Number(searchParams?.page ?? "1");
//   console.log("this is the page", page)
 console.log("✅ PatientsPage — page:", page, "search:", search); // debug

  let patients: Patient[] = [];
  let meta: Meta = { total: 0, page: 1, limit: 12, totalPages: 1 };
  let fetchError: string | null = null;

  try {
    const result = await fetchPatients(page, search);
    patients = result.data;
    // console.log("Patient is here ", patients)
    meta = result.meta;
    // console.log("this is the meta ", meta);
  } catch (err) {
    fetchError = (err as Error).message;
  }

  if (fetchError) {
    return (
      <main className="p-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
          <strong>Error loading patients:</strong> {fetchError}
        </div>
      </main>
    );
  }

  // Build page number array
  const pageNumbers = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Patient grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {patients.map((p) => {
          const contact = p.contact[0];
          return (
            <div
              key={p.patient_id}
              className="border border-gray-200 rounded-2xl p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3 bg-blue-100 p-3">
                <Image
                  src={ "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyYEFP3pgrr6-pMWUYx8VZ068CQZuyFgeiEHVAGv_gl3TcaXMi33OwI-8&s"}
                  alt={p.patient_name}
                  height={20}
                  width={20}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate leading-tight">
                    {p.patient_name}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight">
                    ID-{String(p.patient_id).padStart(4, "0")}
                  </p>
                </div>
                <span className="ml-auto flex-shrink-0 text-xs font-bold bg-blue-500 text-white rounded-full px-2.5 py-1 whitespace-nowrap">
                  Age {p.age}
                </span>
              </div>

              {/* Medical issue pill */}
              <span
                className={`inline-block text-xs font-semibold capitalize px-3 py-1 rounded-md mb-3 ${getIssueStyle(
                  p.medical_issue
                )}`}
              >
                {p.medical_issue}
              </span>

              {/* Contact info */}
              <div className="text-xs text-gray-500 space-y-1.5">
                <div className="flex items-start gap-1.5">
                  {/* Location icon */}
                  <MapPin size={15}/>
                  
                  <span className="truncate text-black">{contact?.address ?? "N/A"}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Phone icon */}
                  <Phone size={15}/>
                  <span className={contact?.number ? "text-black" : "text-red-400"}>
                    {contact?.number ?? "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Email icon */}
                  <Mail size={15}/>
                  <span className={`truncate ${contact?.email ? "text-black" : "text-red-400"}`}>
                    {contact?.email ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1.5 mt-8">
        {/* Previous */}
        {page > 1 ? (
          <a
            href={`/?page=${page - 1}`}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg> */}
            Previous
          </a>
        ) : (
          <button
            disabled
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-100 rounded-lg text-sm text-gray-300 bg-white cursor-not-allowed"
          >
            {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg> */}
            Previous
          </button>
        )}

        {/* Page number buttons */}
        {/* {pageNumbers.map((num) => (
          <a
            key={num}
            href={`/patients?page=${num}`}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              num === meta.page
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 border border-gray-200 bg-white"
            }`}
          >
            {String(num).padStart(2, "0")}
          </a>
        ))} */}

        {/* Next */}
            {page < meta.totalPages ? (
            <a
                href={`/?page=${page + 1}`}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
                Next
                {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg> */}
            </a>
            ) : (
            <button
                disabled
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-100 rounded-lg text-sm text-gray-300 bg-white cursor-not-allowed"
            >
                Next
                {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg> */}
            </button>
            )}
      </div>
    </main>
  );
}