import { useState, useRef, useEffect } from "react";

export function CustomSelect({
    options,
    value,
    onChange,
    placeholder,
    className = "flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-transparent focus-within:border-blue-600 dark:focus-within:border-blue-400 transition-colors relative cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700",
    dropdownClassName = "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1 custom-scrollbar",
    textClassName = "flex-1 text-slate-900 dark:text-white truncate pr-6 text-left font-bold select-none",
    iconClassName = "absolute right-4 text-gray-400 transition-transform duration-200"
}: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    className?: string;
    dropdownClassName?: string;
    textClassName?: string;
    iconClassName?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    return (
        <div 
            ref={dropdownRef}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
            }}
        >
            <div className={textClassName}>
                {selectedLabel}
            </div>
            <div className={`${iconClassName} ${isOpen ? 'rotate-180' : ''}`}>
                ▼
            </div>
            
            {isOpen && (
                <div className={dropdownClassName}>
                    {options.map((option) => {
                        const isSelected = value === option.value;
                        return (
                            <div
                                key={option.value}
                                className={`px-4 py-3 text-left cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-between ${
                                    isSelected 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option.label}</span>
                                {isSelected && <span className="text-white text-sm">✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
