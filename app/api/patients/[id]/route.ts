
import { NextRequest, NextResponse } from "next/server";
import { getPatientById } from "@/lib/getPatients";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const id = Number(params.id)

        // we are validating the id here ->

        if(isNaN(id) || id <= 0) {
            return NextResponse.json({
                error: "Error Patient id , Must be the positive number"
            },{status: 400})
        }

        const patient = getPatientById(id)

        if(!patient) {
            return NextResponse.json(
                {error: "Patient not found"},
                {status: 404}
            )
        }
        return NextResponse.json(patient, {status: 200})
        
    }catch(err) {
        console.log("Something went wrong while fetching the patients",err)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )

    }

}