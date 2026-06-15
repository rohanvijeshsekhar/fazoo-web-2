import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: Logo[];
  items?: string[];
};

export function LogoCloud({ className, logos, items, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={32} reverse duration={60} durationOnHover={25}>
        {logos && logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-6 select-none opacity-55 hover:opacity-100 transition-opacity duration-300 contrast-75 brightness-75 dark:brightness-0 dark:invert object-contain"
            height={logo.height || 24}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width || 120}
          />
        ))}
        {items && items.map((item, idx) => (
          <div
            key={`item-${idx}`}
            className="font-jakarta font-semibold text-[14px] sm:text-[15px] text-faazo-navy/85 hover:text-faazo-teal transition-all duration-300 cursor-default select-none px-4 py-2 rounded-xl bg-white/40 border border-white/50 backdrop-blur-md shadow-[0_2px_10px_rgba(0,111,122,0.03)] flex items-center gap-2 w-max"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-faazo-teal/75 pulse-glow" />
            {item}
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
