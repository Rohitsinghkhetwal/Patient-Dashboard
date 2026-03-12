
import { PatientContact, Patient } from "./Types/types"

import fs from "fs"
import path from "path"

// THis helper function is for fetching all the data; 

export function getAllPatients(): Patient[] {
    const filePath = path.join(process.cwd(), "data", "patients.json");

    if(!fs.existsSync(filePath)) {
        throw new Error(`patients data not found at : ${filePath}`)
    }

    const raw = fs.readFileSync(filePath, "utf-8")

    try {
        return JSON.parse(raw) as Patient[];

    }catch {
        throw new Error("Patients contain invalid JSON")
    }

}

// this function is for the fetching the patient by numeric id

export function getPatientById(id:number): Patient | undefined {
    return getAllPatients().find((p) => p.patient_id === id)
}