import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAF9FF] hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gradient-to-br from-[#EAF9FF] to-[#6BD9FF]/30 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#00ADEF]" />
      </div>
      <h3 className="text-[#004C8C] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
