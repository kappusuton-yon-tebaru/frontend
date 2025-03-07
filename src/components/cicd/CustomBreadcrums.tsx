"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const CustomBreadcrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && !segment.startsWith("["));

  const isMongoObjectId = (segment: string) => /^[a-f\d]{24}$/i.test(segment);

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 bg-ci-modal-black px-8 py-4 fixed w-full border-b border-ci-modal-grey z-100"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/cicd"
            className="underline font-bold text-base underline-offset-4"
          >
            Image and Deployment
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={path} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {isMongoObjectId(segment) ? (
                <span className="font-medium text-ci-modal-grey">
                  {segment}
                </span>
              ) : isLast ? (
                <span className="font-bold">{segment}</span>
              ) : (
                <Link
                  href={path}
                  className="underline font-medium text-base underline-offset-4"
                >
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
