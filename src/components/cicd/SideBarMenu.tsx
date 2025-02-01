"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Link from "next/link";

export interface MenuItem {
  name: string;
  href: string;
  subMenu?: MenuItem[];
}

export default function SideBarMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex">
      <aside className="h-full w-64 bg-ci-modal-black text-white">
        <nav className="py-10 px-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="py-2 text-base font-semibold">
                {item.subMenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.name)}
                      className="flex items-center justify-between w-full p-2 rounded-full"
                    >
                      {item.name}{" "}
                      {openSubMenus[item.name] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {openSubMenus[item.name] && (
                      <ul className="ml-4">
                        {item.subMenu.map((subItem) => (
                          <li
                            key={subItem.name}
                            className="py-1 font-normal text-sm"
                          >
                            <Link
                              href={subItem.href}
                              className="block px-8 py-2 rounded-xl hover:bg-ci-modal-blue"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block p-2 rounded-xl hover:bg-ci-modal-blue"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
