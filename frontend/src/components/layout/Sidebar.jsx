import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShieldCheck, ScanLine, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../ui/Button';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const links = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Products', icon: ShoppingBag, path: '/products' },
        { name: 'Warranties', icon: ShieldCheck, path: '/warranties' },
        { name: 'Scan Receipt', icon: ScanLine, path: '/scan' },
    ];

    const sidebarVariants = {
        open: { width: 260, transition: { duration: 0.3 } },
        closed: { width: 80, transition: { duration: 0.3 } },
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <motion.aside
                variants={!isMobile ? sidebarVariants : {}}
                animate={!isMobile ? (isOpen ? 'open' : 'closed') : (isOpen ? { x: 0 } : { x: -280 })}
                initial={isMobile ? { x: -280 } : false}
                className={cn(
                    "fixed top-0 left-0 h-full bg-slate-900 z-50 flex flex-col border-r border-slate-800 shadow-xl",
                    isMobile ? "w-64" : ""
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                        {(isOpen || isMobile) && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-lg tracking-tight text-white whitespace-nowrap"
                            >
                                WarrantyGuard
                            </motion.span>
                        )}
                    </div>

                    {!isMobile && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors absolute right-[-12px] top-6 bg-slate-900 border border-slate-700 shadow-md"
                        >
                            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )
                            }
                        >
                            <link.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isOpen ? "" : "mx-auto")} />

                            <AnimatePresence>
                                {(isOpen || isMobile) && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {link.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Tooltip for collapsed state */}
                            {!isOpen && !isMobile && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {link.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-400 group",
                            isOpen ? "" : "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {(isOpen || isMobile) && (
                            <span className="font-medium whitespace-nowrap">Logout</span>
                        )}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
