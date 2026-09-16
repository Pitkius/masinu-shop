import { PartView } from "@/components/search/SearchViews";

export default async function PartPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  return <PartView number={number} />;
}
