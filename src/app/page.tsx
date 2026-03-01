import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/** Root page — redirects to dashboard (auth guard handles unauthenticated users). */
export default function RootPage() {
  redirect(ROUTES.DASHBOARD);
}
