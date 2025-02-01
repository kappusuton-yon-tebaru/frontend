import SideBarMenu, { MenuItem } from "@/components/SideBarMenu";
import React from "react"; // Update the path accordingly

const menuItems: MenuItem[] = [
  {
    name: "Images",
    href: "#",
    subMenu: [
      { name: "Services List", href: "" },
      { name: "Images Setting", href: "" },
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
