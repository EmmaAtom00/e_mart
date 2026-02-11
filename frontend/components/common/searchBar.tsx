"use client";
import { Search } from "lucide-react";
import Input from "./input";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
      setValue("");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className={`hidden md:flex items-center bg-secondary gap-3 rounded focus:outline-none focus:border-transparent px-4 md:py-2 text-sm}`}
      >
        <Input
          type="text"
          className="md:block focus:outline-hidden"
          label=""
          placeholder="Search"
          value={value}
          onChange={setValue}
        />
        <button type="submit" className="cursor-pointer hover:opacity-70 transition">
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
