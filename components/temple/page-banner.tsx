import { Badge } from "@/components/ui/badge";
import { MotionFade } from "@/components/temple/motion-fade";

export function PageBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <MotionFade className="relative overflow-hidden rounded-[36px] border border-[rgba(212,175,55,0.2)] bg-[linear-gradient(135deg,rgba(33,7,7,0.94),rgba(59,10,10,0.84),rgba(255,153,51,0.16))] p-8 shadow-aura md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_28%)]" />
      <div className="relative z-10 max-w-3xl">
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-5 text-4xl text-[#FFF8F0] md:text-6xl">{title}</h1>
        <p className="mt-5 text-base leading-8 text-[#E8C7AD] md:text-lg">{subtitle}</p>
      </div>
    </MotionFade>
  );
}
