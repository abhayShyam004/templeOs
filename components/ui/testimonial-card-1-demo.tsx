import { ShieldCheck } from "lucide-react";
import { TestimonialCard } from "@/components/ui/testimonial-card-1";

const featuresData = [
  "51K Happy customers",
  "4.4 Avg ratings",
  "6 months money back gurantee!",
  "Unlimited messaging with your provider",
];

const testimonialsData = [
  {
    name: "Laura Shouse",
    rating: 5,
    quote:
      "When I met Dr. Naji I knew my life was about to change. I have lost over 27 pounds since April of this year. he develops a very specific treatment plan for you that really works.",
  },
  {
    name: "Alex Johnson",
    rating: 5,
    quote:
      "A seamless experience from start to finish. The results exceeded all my expectations. Highly recommended for anyone looking for quality and reliability.",
  },
  {
    name: "Samantha Lee",
    rating: 4,
    quote:
      "Great service and a very professional team. They addressed all my concerns promptly. The final product was fantastic, though there was a slight delay.",
  },
];

export default function TestimonialCardDemo() {
  return (
    <div className="flex min-h-[600px] w-full items-center justify-center bg-background p-4">
      <TestimonialCard
        logo={<ShieldCheck className="h-6 w-6 text-green-600" />}
        overallRating={4.4}
        totalRatingsText="4.4 Ratings"
        title="Join thousands of happy customers"
        features={featuresData}
        testimonials={testimonialsData}
      />
    </div>
  );
}
