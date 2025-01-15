"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../app/config/AuthContext";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "employee", "project"],
      },
      {
        icon: "/employees.png",
        label: "Employee",
        href: "/employees",
        visible: ["admin", "employee"],
      },
      {
        icon: "/project.png",
        label: "Projects",
        href: "/projects",
        visible: ["admin", "projects"],
      },
      {
        icon: "/parent.png",
        label: "Roles",
        href: "/roles",
        visible: ["admin", "roles"],
      },
      {
        icon: "/class.png",
        label: "Skills",
        href: "/skills",
        visible: ["admin", "skills"],
      },
      {
        icon: "/more.png",
        label: "Employee Project",
        href: "/manage",
        visible: ["admin", "manage"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  const isActiveItem = (itemHref: string) => {
    if (itemHref === "/admin") {
      return pathname === "/" || pathname === "/admin";
    }
    if (itemHref === "/employees") {
      return pathname.startsWith("/employees");
    }
     if(itemHref === "/projects") {
       return pathname.startsWith("/projects");
    }
     if(itemHref === "/roles") {
        return pathname.startsWith("/roles");
    }
    if(itemHref === "/skills") {
        return pathname.startsWith("/skills");
    }
    if(itemHref === "/manage") {
         return pathname.startsWith("/manage");
    }
    return pathname === itemHref;
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            const isActive = isActiveItem(item.href);

            if (item.label === "Logout") {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight ${
                    isActive ? "font-bold text-lamaBlack bg-lamaGreen" : ""
                  }`}
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight ${
                  isActive ? "font-bold text-lamaBlack bg-lamaGreen" : ""
                }`}
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;