import PollDetailsPage from "./PollDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const pollId = parseInt(id);

  return <PollDetailsPage pollId={pollId} />;
}
