"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const CustomBreadcrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && !segment.startsWith("["));

  return (
    <nav aria-label="breadcrumb" className="text-ci-white px-16 pt-20 text-lg">
      <button
        onClick={() => router.back()}
        className="text-ci-white hover:underline mb-4"
      >
        ← Back
      </button>
      <ol className="flex space-x-2">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={path} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-ci-modal-blue">{segment}</span>
              ) : (
                <Link href={path} className="hover:underline">
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumbs;
