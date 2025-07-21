// app/add-enquiry/page.tsx
import { auth } from "@clerk/nextjs/server"
import { GymEnquiryForm } from "@/components/gym-enquiry-form"

export default async function AddEnquiryPage() {
  const { userId } = await auth();

  if (!userId) return <div>Not authorized</div>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <GymEnquiryForm onSubmit={() => {}} onCancel={() => {}} />
    </div>
  );
}

