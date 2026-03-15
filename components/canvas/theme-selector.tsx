"use client"

import { CheckIcon } from "lucide-react";
import { useCanvas } from "../../context/canvas-context";
import { parseThemeColors, type ThemeType } from "../../lib/themes";
import { cn } from "../../lib/utils";

const ThemeSelector = () => {
    const { themes, theme: currentTheme, setTheme } = useCanvas();
    return (
        <div className="flex flex-col max-h-96">
            <div className="flex-1 pb-2 px-4 overflow-y-auto">
                <h3 className="font-semibold text-sm mb-2">Select A Theme</h3>
                <div className="py-2 space-y-3">
                    {themes?.map((theme) => (
                        <ThemeItem
                            key={theme.id}
                            theme={theme}
                            isSelected={currentTheme?.id === theme.id}
                            onSelect={() => setTheme(theme.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ThemeItem({
    theme,
    isSelected,
    onSelect
}: {
    theme: ThemeType
    isSelected: boolean
    onSelect: () => void
}) {
    const color = parseThemeColors(theme.style);
    return (
        // <button
        //     onClick={onSelect}
        //     className={cn(`flex items-center justify-between w-full p-1 rounded-xl border gap-4 bg-background`, isSelected ? "border-2" : "border")}
        //     style={{
        //         borderColor: isSelected ? color.primary : "",
        //     }}
        // >
        //     <div className="flex gap-2">
        //         {["primary", "secondary", "accent", "muted"].map((key) => (
        //             <div 
        //                 key={key}
        //                 className="w-4 h-4 rounded-full border"
        //                 style={{
        //                     backgroundColor: color[key],
        //                     borderColor: "#ccc",
        //                 }}
        //             />
        //         ))}
        //     </div>
        //     <div className="flex items-center gap-2 flex-[0.9]">
        //         <span className="text-sm">{theme.name}</span>
        //         {isSelected && <CheckIcon size={16} color={color.primary}/>}
        //     </div>
        // </button>
        <button
            onClick={onSelect}
            className={cn(
                "flex items-center justify-between w-full p-2 rounded-xl border gap-4 bg-background hover:bg-muted/50 transition-all",
                isSelected ? "border-2 shadow-sm" : "border"
            )}
            style={{
                borderColor: isSelected ? color.primary : "",
            }}
        >
            <div className="flex gap-2">
                {["primary", "secondary", "accent", "muted"].map((key) => (
                    <div
                        key={key}
                        className="w-4 h-4 rounded-full border shadow-sm transition-transform hover:scale-110"
                        style={{
                            backgroundColor: color[key as keyof typeof color],
                            borderColor: "#ccc",
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-2 flex-[0.9]">
                <span className="text-sm">{theme.name}</span>
                {isSelected && <CheckIcon size={16} color={color.primary} />}
            </div>
        </button>
    )
}

export default ThemeSelector;
