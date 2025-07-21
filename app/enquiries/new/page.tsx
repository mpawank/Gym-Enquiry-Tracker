import { auth } from "@clerk/nextjs/server"
import { GymEnquiryForm } from "@/components/gym-enquiry-form"

export default async function EnquiryPage() {
  const { userId } = await auth();

  if (!userId) return <div>Not authorized</div>;

  return <GymEnquiryForm onSubmit={() => {}} onCancel={() => {}} />;
}
