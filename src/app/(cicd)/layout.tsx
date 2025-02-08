import SideBarMenu, { MenuItem } from "@/components/cicd/SideBarMenu";
import React from "react"; // Update the path accordingly

const menuItems: MenuItem[] = [
  {
    name: "Images",
    href: "#",
    subMenu: [
      { name: "Services List", href: "http://localhost:3000/images/projectSpaces" },
      { name: "Registry List", href: "http://localhost:3000/images/registry" },
      { name: "Images Setting", href: "http://localhost:3000/images/settings" },
    ],
  },
  {
    name: "Deployment",
    href: "#",
    subMenu: [
      { name: "Deployment List", href: "" },
      { name: "Deployment Setting", href: "" },
    ],
  },
  {
    name: "Operarion",
    href: "http://localhost:3000/operation",
    subMenu: [
      { name: "Build and Deploy", href: "" },
      { name: "Jobs Status", href: "" },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <SideBarMenu menuItems={menuItems} />
      <div className="flex-1">
        <main>{children}</main>
      </div>
    </div>
  );
}
