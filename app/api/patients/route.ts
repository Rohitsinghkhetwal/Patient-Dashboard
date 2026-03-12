
import { NextRequest, NextResponse } from "next/server";
import { getAllPatients } from "@/lib/getPatients";
import { Patient } from "@/lib/Types/types";


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
        const limit = Math.min(100, Number(searchParams.get("limit") ?? "12"))
        const search = (searchParams.get("search") ?? "").toLowerCase().trim();
        const issue = (searchParams.get("medical_issue") ?? "").toLowerCase().trim()
        const sortBy = (searchParams.get("sort_by") ?? "patient_id") as keyof Patient;
        const sortDir = (searchParams.get("sort_dir") ?? "asc") === "desc" ? "desc" : "asc";
        
        //fetch all the Patient data here ->
        let patients = getAllPatients()


        if (issue) {
            patients = patients.filter((p) =>
                p.medical_issue.toLowerCase() === issue
            )
        }

        if (search) {
            patients = patients.filter(
                (p) =>
                    p.patient_name.toLowerCase().includes(search) ||
                    p.contact.some(
                        (c) =>
                            c.email.toLowerCase().includes(search) ||
                            c.address.toLowerCase().includes(search)
                    )
            );
        }

        patients = [...patients].sort((a, b) => {
            const aVal = a[sortBy]
            const bVal = b[sortBy]

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();
            if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
            return 0;
        })

        // WE will do pagination here 
        const total = patients.length;
        const totalPages = Math.max(1, Math.ceil(total/limit))
        const data = patients.slice((page -1) * limit, page * limit)

        return NextResponse.json({
            data,
            meta: {total, page, limit, totalPages},
            
        },{
            status: 200
        })

    } catch (err) {
        console.log('Something went wrong ', err)
        return NextResponse.json({
            error: "Failed to load patients data"
        }, { status: 500 })
    }
}