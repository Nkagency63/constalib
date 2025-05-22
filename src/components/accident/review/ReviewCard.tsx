
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

const ReviewCard = ({ icon, title, children, className }: ReviewCardProps) => {
  return (
    <div className={cn("border rounded-lg p-4 bg-white", className)}>
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <h4 className="font-medium text-constalib-dark">{title}</h4>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
