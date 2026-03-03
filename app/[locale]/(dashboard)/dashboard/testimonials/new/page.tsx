import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TestimonialForm } from "../_components/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/testimonials"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            New Testimonial
          </h1>
          <p className="text-muted-foreground">Add a new testimonial</p>
        </div>
      </div>

      <TestimonialForm mode="create" />
    </div>
  );
}
