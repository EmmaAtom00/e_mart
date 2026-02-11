"use client";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [searchValue, setSearchValue] = useState("");

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50 md:hidden"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:hidden px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4 animate-in fade-in slide-in-from-top-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Search Products</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition"
                            aria-label="Close search"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center gap-3 bg-secondary rounded px-4 py-3 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
                            autoFocus
                        />
                        <Search size={20} className="text-gray-400 cursor-pointer" />
                    </div>

                    {/* Search Results or Suggestions */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {searchValue ? (
                            <div className="text-sm text-gray-600 py-4 text-center">
                                Searching for "{searchValue}"...
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 py-4 text-center">
                                <p className="mb-3">Popular searches:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {["iPhone", "Laptop", "Headphones", "Tablet"].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setSearchValue(item)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-secondarytwo text-white py-2 rounded font-medium hover:opacity-90 transition text-sm"
                    >
                        Search
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchModal;
