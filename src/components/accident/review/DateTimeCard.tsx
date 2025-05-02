
import { Calendar, Clock } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface DateTimeCardProps {
  date: string;
  time: string;
}

const DateTimeCard = ({ date, time }: DateTimeCardProps) => {
  return (
    <ReviewCard icon={<Calendar className="h-5 w-5 text-constalib-blue" />} title="Date et heure">
      <p className="text-sm text-constalib-dark-gray">{date} à {time}</p>
    </ReviewCard>
  );
};

export default DateTimeCard;
