import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the props interface for the component
export interface CtaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: React.ReactNode;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

// Reusable CtaCard component with a clean, modern layout
const CtaCard = React.forwardRef<HTMLDivElement, CtaCardProps>(
  ({ className, imageSrc, imageAlt, title, subtitle, description, buttonText, onButtonClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-3xl border border-white/45 bg-white/35 backdrop-blur-xl shadow-xl shadow-[#006F7A]/5",
          "flex flex-col md:flex-row items-stretch", // Stacks on mobile, row on desktop
          className
        )}
        {...props}
      >
        {/* Image Section */}
        <div className="md:w-[38%] w-full min-h-[240px] md:min-h-auto relative overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" // Ensure image covers the area
          />
          {/* Soft color matching overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#E6F3F5]/10 pointer-events-none"></div>
        </div>

        {/* Content Section */}
        <div className="md:w-[62%] w-full p-8 sm:p-10 md:p-12 flex flex-col justify-center">
          <div>
            <p className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.18em] text-fazo-teal uppercase font-sans">{title}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight font-jakarta text-fazo-navy leading-[1.2]">
              {subtitle}
            </h2>
            <p className="mt-4 text-fazo-gray text-sm sm:text-[15px] leading-relaxed font-sans max-w-[560px]">
              {description}
            </p>
            <div className="mt-8">
              <Button 
                size="lg" 
                onClick={onButtonClick} 
                className="btn-3d-teal text-white rounded-xl px-8 py-3.5 shadow-md hover:-translate-y-0.5 transition-all duration-300 font-jakarta font-bold text-sm sm:text-[15px]"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CtaCard.displayName = "CtaCard";

export { CtaCard };
