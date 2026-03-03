import { TestimonialsGrid } from "./_components/TestimonialsGrid";

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage client testimonials and reviews
        </p>
      </div>
      <TestimonialsGrid />
    </div>
  );
}
