import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      qs.set(key, Array.isArray(value) ? value[0] : String(value));
    }
  });
  const query = qs.toString();
  redirect(`/dashboard/overview${query ? `?${query}` : ""}`);
}
