import React from 'react'

const InfoRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
      <span className="text-white/70 flex items-center text-sm">
        {icon}
        {label}
      </span>
      <span className="text-white font-medium text-sm">{value || '—'}</span>
    </div>
  );




 
export default InfoRow
