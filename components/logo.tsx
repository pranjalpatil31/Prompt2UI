import Link from "next/link";
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group select-none"
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-primary text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/40">
        <Sparkles size={18} />
      </div>

      {/* Logo Text */}
      <h1 className="text-2xl font-extrabold tracking-tight flex items-center">
        <span className="bg-gradient-to-r from-purple-500 via-primary to-indigo-500 bg-clip-text text-transparent">
          Prompt
        </span>
        <span className="mx-1 text-foreground">2</span>
        <span className="bg-gradient-to-r from-indigo-500 via-primary to-purple-500 bg-clip-text text-transparent">
          UI
        </span>
      </h1>
    </Link>
  );
};

export default Logo;