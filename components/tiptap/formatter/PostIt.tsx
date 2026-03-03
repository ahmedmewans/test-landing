import { Lightbulb } from "lucide-react";
import type React from "react";

interface PostItProps {
  title: string;
  children: React.ReactNode;
}

const PostIt: React.FC<PostItProps> = ({ title, children }) => {
  return (
    <div className="relative my-16 mx-4">
      {/* Tape effect */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 backdrop-blur-md border border-white/30 -rotate-2 z-10 shadow-sm" />

      <div className="relative bg-[#FFC760] p-10 rounded-sm shadow-[12px_12px_0px_0px_rgba(90,57,39,0.1)] rotate-1 transform-gpu transition-all hover:rotate-0 hover:scale-[1.02] border-l-4 border-[#FA9939]">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-graph-paper opacity-[0.05] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="text-[#5A3927]/60" size={24} />
            <h4 className="font-serif italic text-2xl font-black text-[#5A3927]">
              {title}
            </h4>
          </div>
          <div className="text-[#5A3927]/80 leading-relaxed font-semibold text-lg italic">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostIt;
