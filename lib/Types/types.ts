export interface PatientContact {
    address: string;
    number: string;
    email: string
}

export interface Patient {
    patient_id: number;
    patient_name: string;
    age: number;
    photo_url: string;
    contact: PatientContact[];
    medical_issue: string
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface ApiResponse {
    data: Patient[],
    meta: Pagination;
}

export interface FilterOptions {
    label: string;
    value: string;
}

export interface SortOption {
    label: string;
    value: string;
    direction: "asc" | "desc"
}