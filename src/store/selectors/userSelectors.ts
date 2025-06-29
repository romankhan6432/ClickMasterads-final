import { RootState } from "@/modules/store";

 
export const selectUserBalance = (state: RootState) => state.public.auth.user?.balance || 0

 