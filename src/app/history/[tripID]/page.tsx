import TripDetails from "@/components/history/TripDetails";

interface Props {
  params: {
    tripID: string;
  };
}

export default function HistoryDetailPage({ params }: Props) {
  return <TripDetails tripId={params.tripID} />;
}
