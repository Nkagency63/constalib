
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:translate-y-[-5px]">
      <div className="w-14 h-14 rounded-xl bg-constalib-light-blue flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-constalib-blue" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-constalib-dark">{title}</h3>
      <p className="text-constalib-dark-gray">{description}</p>
    </div>
  );
};

export default FeatureCard;
