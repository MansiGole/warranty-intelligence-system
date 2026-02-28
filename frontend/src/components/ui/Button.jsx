import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background transition-transform active:scale-95 duration-200',
    {
        variants: {
            variant: {
                default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20',
                destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
                outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900',
                secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
                ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
                link: 'text-indigo-600 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-lg',
                lg: 'h-11 px-8 rounded-xl text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = ({ className, variant, size, isLoading, children, ...props }) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
};

export { Button, buttonVariants };
