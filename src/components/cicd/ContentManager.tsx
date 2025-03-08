"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export interface Header {
  label: string;
  desc: string;
}
export interface Service {
  name: string;
  path: string;
  description: string;
}

export interface Link {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}

export interface Content {
  text: string;
  hasLink?: boolean;
  link?: Link;
}

export interface ContentManagerProps {
  title: string;
  desc: string;
  services?: Service[];
  content?: Content[];
}

export default function ContentManager({
  header,
  topic,
}: {
  header: Header;
  topic: ContentManagerProps[];
}) {
  const router = useRouter();

  return (
    <div className="px-16 py-8 flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-4 w-full items-center">
        <h2 className="text-3xl font-bold">{header.label}</h2>
        <div className="text-xl">{header.desc}</div>
      </div>
      <hr className="border-t border-gray-300 col-span-6" />
      <div className="w-full bg-ci-bg-dark-blue flex flex-col gap-y-8">
        {topic.map(({ title, desc, content, services }, index) => (
          <div key={index} className="flex flex-col gap-y-4 w-full">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="text-base">{desc}</div>
            {services && services.length > 0 && (
              <div className="flex flex-row gap-x-4">
                {services.map(({ name, path, description }) => (
                  <div
                    key={name}
                    className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey rounded-lg w-1/2 cursor-pointer"
                    onClick={() => router.push(path)}
                  >
                    <div className="flex flex-col px-6 py-3 gap-y-4 select-none">
                      <h3 className="text-base font-bold">{name}</h3>
                      <div className="text-ci-modal-grey">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {content &&
              content.map(({ text, hasLink, link }, index) => (
                <div key={index} className="flex flex-row">
                  {hasLink && link ? (
                    <>
                      {text}&nbsp;
                      <a
                        href={link.href}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-ci-modal-light-blue underline"
                      >
                        {link.label}
                      </a>
                      <Image
                        src={link.imageSrc}
                        alt={link.imageAlt}
                        width={20}
                        height={20}
                      />
                    </>
                  ) : (
                    text
                  )}
                </div>
              ))}
            <hr className="border-t border-gray-300 col-span-6 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
