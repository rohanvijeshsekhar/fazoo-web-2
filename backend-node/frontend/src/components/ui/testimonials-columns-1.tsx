"use client";
import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 sm:p-10 rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl shadow-lg shadow-[#006F7A]/5 max-w-xs w-full glass-card transition-all duration-300" key={i}>
                  <div className="text-fazo-navy text-sm sm:text-[15px] leading-relaxed font-sans text-left">{text}</div>
                  <div className="flex flex-col mt-5 text-left items-start">
                    <div className="font-jakarta font-bold text-sm text-fazo-navy tracking-tight leading-5">{name}</div>
                    <div className="font-sans text-[11px] font-semibold text-fazo-teal tracking-wide leading-5">{role}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
