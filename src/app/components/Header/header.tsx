"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerOptions = [
    { title: "Home", link: "https://social63319.wixstudio.com/wheelchair-seating-m" },
    { title: "About", link: "https://social63319.wixstudio.com/wheelchair-seating-m/blank-9" },
    { title: "Our Solutions", link: "https://social63319.wixstudio.com/wheelchair-seating-m/blank-11" },
    { title: "Resources", link: "https://social63319.wixstudio.com/wheelchair-seating-m/blank-8" },
    { title: "Clinical", link: "https://social63319.wixstudio.com/wheelchair-seating-m/blank-10" },
    { title: "Blog", link: "https://social63319.wixstudio.com/wheelchair-seating-m/news" },
    { title: "Find a Rep", link: "http://62.72.59.202:3003/finduser" },
    { title: "Faq", link: "https://social63319.wixstudio.com/wheelchair-seating-m/blank-13" },
  ];

  return (
    <header className="flex items-center justify-center py-6 bg-white shadow-sm relative z-50">
      <div className="flex items-center justify-between w-full max-w-[1400px] px-6 md:px-12">
        <a
          href="https://social63319.wixstudio.com/wheelchair-seating-m?rc=test-site"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/anacmlogo.avif"
            alt="Company Logo"
            className=" h-auto object-contain"
          />
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {headerOptions.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`nav-link text-[17px] font-[400] text-black hover:text-[#a12b6b] transition-colors`}
            >
              {item.title}
            </a>
          ))}
        </nav>

        <a
          href="https://social63319.wixstudio.com/wheelchair-seating-m/blank-12"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block bg-[#a12b6b] text-white font-semibold px-12 py-5 rounded-md hover:bg-[#8e225f] transition-colors"
        >
          Contact Us
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#a12b6b] focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col p-9 space-y-4 py-6 md:hidden">
          {headerOptions.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[17px] font-medium text-black hover:text-[#a12b6b] transition-colors"
            >
              {item.title}
            </a>
          ))}
          <a
            href="https://social63319.wixstudio.com/wheelchair-seating-m/blank-12"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#a12b6b] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#8e225f] transition-colors"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
