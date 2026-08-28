import React from 'react';

interface FineHairLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const FineHairLogo: React.FC<FineHairLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showSubtitle = false,
}) => {
  const isLight = variant === 'light';
  const isGold = variant === 'gold';

  const textColor = isLight ? '#FFFFFF' : isGold ? '#D4AF37' : '#111111';
  const accentColor = isGold ? '#E5C058' : '#B89758';
  const subtitleColor = isLight ? '#CCCCCC' : '#777777';

  // Sizing matrix
  const sizeStyles = {
    sm: { width: 120, height: 28, text: '16px', sub: '7px' },
    md: { width: 160, height: 38, text: '22px', sub: '8.5px' },
    lg: { width: 220, height: 52, text: '30px', sub: '10px' },
    xl: { width: 280, height: 68, text: '38px', sub: '12px' },
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center space-x-1.5">
        {/* Vector representation of official FIN≡ HΛiR styling */}
        <svg
          viewBox="0 0 280 44"
          className="h-auto"
          style={{ width: `${sizeStyles.width}px` }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* F */}
          <path
            d="M8 8H24V14H15V20H22V26H15V36H8V8Z"
            fill={textColor}
          />
          {/* I */}
          <path
            d="M33 8H40V36H33V8Z"
            fill={textColor}
          />
          {/* N */}
          <path
            d="M49 8H56L67 25V8H74V36H67L56 19V36H49V8Z"
            fill={textColor}
          />
          {/* ≡ (Triple Bar stylized E from official logo) */}
          <path
            d="M83 10H103V15H83V10ZM83 19.5H103V24.5H83V19.5ZM83 29H103V34H83V29Z"
            fill={accentColor}
          />

          {/* SPACE */}

          {/* H */}
          <path
            d="M120 8H127V19H142V8H149V36H142V25H127V36H120V8Z"
            fill={textColor}
          />
          {/* Λ (Chevron A from official logo) */}
          <path
            d="M167 8H174L188 36H180.5L170.5 15.5L160.5 36H153L167 8Z"
            fill={textColor}
          />
          {/* i (Stylized dotted I) */}
          <circle cx="199" cy="11" r="3.5" stroke={accentColor} strokeWidth="2.5" fill="none" />
          <path d="M196 18H202V36H196V18Z" fill={textColor} />
          {/* R */}
          <path
            d="M211 8H227C232.5 8 236 11.5 236 16.5C236 20.5 233.5 23.5 229.5 24.5L237 36H228.5L221.5 25H218V36H211V8ZM218 13.5V20H226C228.5 20 230 18.5 230 16.5C230 14.5 228.5 13.5 226 13.5H218Z"
            fill={textColor}
          />
        </svg>
      </div>

      {showSubtitle && (
        <div className="flex items-center justify-between mt-0.5 tracking-[0.25em] uppercase font-light text-[8px] sm:text-[9px]" style={{ color: subtitleColor }}>
          <span>RAW HAIR</span>
          <span className="text-[#D4AF37]">•</span>
          <span>EXTENSIONS</span>
          <span className="text-[#D4AF37]">•</span>
          <span>FINETOUCH ATELIER</span>
        </div>
      )}
    </div>
  );
};
