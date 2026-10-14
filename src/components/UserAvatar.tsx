import React, { useState, useEffect } from 'react';
import { getInitials, getInitialsColor } from '../utils/imageValidation';
import { User } from 'lucide-react';

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  ring?: boolean;
  ringClassName?: string;
  levelBadge?: number;
  alt?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-14 h-14 text-base font-extrabold',
  xl: 'w-20 h-20 sm:w-24 sm:h-24 text-xl sm:text-2xl font-black',
  '2xl': 'w-28 h-28 sm:w-32 sm:h-32 text-2xl sm:text-3xl font-black'
};

const badgeSizeClasses = {
  xs: 'w-3.5 h-3.5 text-[8px] -bottom-0.5 -right-0.5',
  sm: 'w-4 h-4 text-[9px] -bottom-0.5 -right-0.5',
  md: 'w-5 h-5 text-[10px] -bottom-1 -right-1',
  lg: 'w-6 h-6 text-xs -bottom-1 -right-1',
  xl: 'w-7 h-7 sm:w-8 sm:h-8 text-xs -bottom-1.5 -right-1.5',
  '2xl': 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm -bottom-2 -right-2'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'Student Scholar',
  size = 'md',
  className = '',
  ring = true,
  ringClassName = 'ring-2 ring-[#E96746]/40',
  levelBadge,
  alt,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = getInitials(name);
  const colorStyle = getInitialsColor(name);
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const hasValidPhoto = Boolean(src && src.trim() && !imageError);

  const containerClasses = [
    'relative inline-flex items-center justify-center shrink-0 rounded-full select-none transition-transform',
    sizeClass,
    ring ? ringClassName : '',
    onClick ? 'cursor-pointer hover:opacity-95' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label={alt || `${name}'s profile avatar`}
    >
      {hasValidPhoto ? (
        <img
          src={src!}
          alt={alt || name}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover shadow-inner"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center border shadow-inner ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}
        >
          {initials ? (
            <span className="tracking-wider uppercase drop-shadow-xs">{initials}</span>
          ) : (
            <User className="w-1/2 h-1/2 opacity-80" />
          )}
        </div>
      )}

      {levelBadge !== undefined && (
        <div
          className={`absolute rounded-full bg-[#E96746] text-white flex items-center justify-center font-black shadow-md border-2 border-white dark:border-[#12233A] ${
            badgeSizeClasses[size] || badgeSizeClasses.md
          }`}
          title={`Level ${levelBadge}`}
        >
          {levelBadge}
        </div>
      )}
    </div>
  );
};
