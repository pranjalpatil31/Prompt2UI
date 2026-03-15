// "use client"

// import { CameraIcon, ChevronDown, Palette, Save, Wand2 } from "lucide-react";
// import { useCanvas } from "../../context/canvas-context";
// import { Button } from "../ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import PromptInput from "../prompt-input";
// import { useState } from "react";
// import { parseThemeColors } from "../../lib/themes";
// import { cn } from "../../lib/utils";
// import ThemeSelector from "./theme-selector";
// import { Separator } from "../ui/separator";

// const CanvasFloatingToolbar = () => {
//   const { themes, theme: currentTheme, setTheme } = useCanvas();
//   const [ promptText, setPromptText ]  = useState<string>("");
//   return (
//     <div className="fixed top-6 left-1/2 -translate-x-1/2">
//       <div className="w-full max-w-2xl bg-background dark:bg-gray-950 rounded-full shadow-xl border">
//         <div className="flex flex-row items-center gap-2 px-3">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 size="icon-sm"
//                 className="px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-200/50 cursor-pointer"
//               >
//                 <Wand2 className="size-4"/>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-2! rounded-xl! shadow-lg border mt-1">
//               <PromptInput 
//                 promptText={promptText}
//                 setPromptText={setPromptText}
//                 className="min-h-37.5 ring-1! ring-purple-500! rounded-xl! shadow-none border-muted"
//                 hideSubmitBtn={true}
//               />
//               <Button
//                 className="mt-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-200/50 cursor-pointer"
//               >
//                 Generate UI
//               </Button>
//             </PopoverContent>
//           </Popover>

//           <Popover>
//             <PopoverTrigger>
//             <div className="flex items-center gap-2 px-3 py-2">
//               <Palette className="sixe-4 "/>
//               <div className="flex gap-1.5">
//                 {themes?.slice(0,4)?.map((theme, index) => {
//                   const color = parseThemeColors(theme.style)
//                   return (
//                     <div
//                       role="button"
//                       key={index}
//                       onClick={(e) => { e.stopPropagation(); setTheme(theme.id) }}
//                       className={cn(
//                         `w-6.5 h-6.5 rounded-full cursor-pointer`,
//                         currentTheme?.id === theme.id && "ring-1 ring-offset-1"
//                       )}
//                       style={{
//                         background: `linear-gradient(135deg, ${color.primary}, ${color?.accent})`
//                       }}
//                     />
//                   )
//                 })}
//               </div>
//               <div className="flex items-center gap-1 text-sm">
//                 +{themes?.length -4}more
//                 <ChevronDown className="size-4"/>
//               </div>
//             </div>
//             </PopoverTrigger>
//             <PopoverContent className="px-2 rounded-xl shadow border">
//               <ThemeSelector />
//             </PopoverContent>
//           </Popover>

//           {/* Divider */}
//           <Separator orientation="vertical" className="h-4!"/>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="icon-sm"
//               className="rounded-full cursor-pointer"
//             >
//               <CameraIcon className="size-4.5"/>
//             </Button>
//             <Button
//               variant="default"
//               size="sm"
//               className="rounded-full cursor-pointer"
//             >
//               <Save className="size-4"/>
//               Save
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CanvasFloatingToolbar;


"use client"

import { CameraIcon, ChevronDown, Palette, Save, Wand2 } from "lucide-react";
import { useCanvas } from "../../context/canvas-context";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PromptInput from "../prompt-input";
import { useState } from "react";
import { parseThemeColors } from "../../lib/themes";
import { cn } from "../../lib/utils";
import ThemeSelector from "./theme-selector";
import { Separator } from "../ui/separator";

const CanvasFloatingToolbar = () => {
  const { themes, theme: currentTheme, setTheme } = useCanvas();
  const [promptText, setPromptText] = useState<string>("");
  const visibleThemes = themes
  ?.filter((t) => t.id === currentTheme?.id)
  ?.concat(themes?.filter((t) => t.id !== currentTheme?.id))
  ?.slice(0, 4);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4">

      {/* Floating Toolbar */}
      <div className="w-150 bg-background/70 dark:bg-gray-950/70 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_12px_45px_rgba(0,0,0,0.25)]">

        <div className="flex items-center gap-4 px-4 py-2.5">

          {/* AI Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon-sm"
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <Wand2 className="size-4"/>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-3 rounded-xl shadow-xl border border-border/50 mt-2 backdrop-blur-lg">

              <PromptInput
                promptText={promptText}
                setPromptText={setPromptText}
                className="min-h-36 rounded-lg border-muted ring-1 ring-purple-500 shadow-none"
                hideSubmitBtn={true}
              />

              <Button
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-[1.02] hover:shadow-md transition-all"
              >
                Generate UI
              </Button>

            </PopoverContent>
          </Popover>

          {/* Theme Picker */}
          <Popover>
            <PopoverTrigger asChild>

              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer">

                <Palette className="size-4 text-muted-foreground"/>

                <div className="flex gap-2">

                  {visibleThemes?.map((theme, index) => {
                    const color = parseThemeColors(theme.style)

                    return (
                      <div
                        role="button"
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setTheme(theme.id) }}

                        className={cn(
                          "w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-purple-400",
                          currentTheme?.id === theme.id && "ring-2 ring-offset-2 ring-purple-500"
                        )}

                        style={{
                          background: `linear-gradient(135deg, ${color.primary}, ${color.accent})`
                        }}
                      />
                    )

                  })}

                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">

                  +{themes?.length - 4} Explore

                  <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180"/>

                </div>

              </div>

            </PopoverTrigger>

            <PopoverContent className="px-3 py-2 rounded-xl shadow-xl border border-border/60">
              <ThemeSelector />
            </PopoverContent>

          </Popover>

          {/* Divider */}
          <Separator orientation="vertical" className="h-6 opacity-60"/>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="icon-sm"
              className="h-9 w-9 rounded-xl hover:bg-muted hover:scale-105 transition-all duration-200"
            >
              <CameraIcon className="size-4"/>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="rounded-xl px-4 hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <Save className="size-4"/>
              Save
            </Button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default CanvasFloatingToolbar;