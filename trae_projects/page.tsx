import { redirect } from 'next/navigation';

export default async function QuestionnaireEntry({ params }: { params: Promise<{ symptomId: string }> }) {
  const { symptomId } = await params;
  redirect(`/survey?symptom=${encodeURIComponent(symptomId)}`);
}

