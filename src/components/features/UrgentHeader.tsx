import type { FC } from 'react';

interface UrgentHeaderProps {
  text: string;
}

const UrgentHeader: FC<UrgentHeaderProps> = ({ text }) => {
  return (
    <header className="bg-destructive text-destructive-foreground p-3 text-center font-bold text-lg md:text-xl shadow-md">
      <p>{text}</p>
    </header>
  );
};

export default UrgentHeader;
