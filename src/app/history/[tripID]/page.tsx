import TripDetails from "@/components/history/TripDetails";

type Params = Promise<{ tripID: string }>;

export default async function HistoryDetailPage({ params }: { params: Params }) {
  const { tripID } = await params;

  return <TripDetails tripId={tripID} />;
}
