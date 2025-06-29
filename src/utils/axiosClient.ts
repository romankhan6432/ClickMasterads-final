"use client"

import axios from "axios";

// utils/axiosClient.ts
const baseURL = typeof window !== 'undefined'  ? `${window.location.origin}/api`: process.env.NEXT_PUBLIC_API_BASE_URL ;

export const axiosClient = axios.create({ baseURL });
