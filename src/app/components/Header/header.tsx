"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerOptions = [
    { title: "Home", link: "https://www.matrixseatingusa.com/" },
    { title: "About", link: "https://www.matrixseatingusa.com/about" },
    { title: "Products", link: "https://www.matrixseatingusa.com/products" },
    { title: "Resources", link: "https://www.matrixseatingusa.com/resources" },
    { title: "Clinical", link: "https://www.matrixseatingusa.com/clinical" },
    { title: "Find a Rep", link: "http://72.60.121.12:3003/finduser" },
    { title: "FAQ", link: "https://www.matrixseatingusa.com/faq" },
    { title: "Order Forms", link: "https://www.matrixseatingusa.com/order-form" },
  ];

  return (
    <header className="flex items-center justify-center py-6 lg:py-10 bg-white shadow-sm relative z-50">
      <div className="flex items-center justify-between w-full max-w-[1400px] px-4 sm:px-6 lg:px-2">
        
        <a
          href="https://www.matrixseatingusa.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <img
            src="/anacmlogo.avif"
            alt="Company Logo"
            className="w-[140px] sm:w-[170px] lg:w-full h-auto object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
          {headerOptions.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-[16px] xl:text-[18px] font-[500] text-black hover:text-[#a12b6b] transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <a
          href="https://www.matrixseatingusa.com/contact-us"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-block bg-[#a12b6b] text-white font-semibold px-6 xl:px-12 py-3 xl:py-5 rounded-md hover:bg-black transition-colors"
        >
          Contact Us
        </a>

        {/* Mobile Menu Trigger (visible until large screens) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#a12b6b] focus:outline-none"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Drawer (visible on ALL sizes <1024px, including 768px) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col p-6 sm:p-8 space-y-4 lg:hidden animate-slide-down">
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
            href="https://www.matrixseatingusa.com/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#a12b6b] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#8e225f] transition-colors text-center"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
