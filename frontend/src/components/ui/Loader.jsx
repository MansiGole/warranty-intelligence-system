import { motion } from "framer-motion";

export const Loader = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/50 ${className}`}
            {...props}
        />
    );
};
