"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CicdHomePage() {
  const router = useRouter();

  const topic = [
    {
      title: "Available Services",
      desc: "Let's your build and deploy process easier.",
    },
    {
      title: "How it works?",
      desc: "You will need to.",
      content: [
        {
          text: "1. Already have created project and already link it with Github",
        },
        {
          text: "2. Create your own AWS ECR repository and generate access_key, secret_access_key. Or Docker Hub repository with a token.",
        },
        {
          text: "3. After that add your ECR repository to our service in",
          hasLink: true,
          link: {
            href: "http://localhost:3000/cicd/images/registry/create",
            label: "Add Registry Page",
            imageSrc: "/images/cicd/link.svg",
            imageAlt: "link logo",
          },
        },
        {
          text: "**Optional: you can adjust max worker for image building in",
          hasLink: true,
          link: {
            href: "http://localhost:3000/cicd/images/setting",
            label: "Image Setting",
            imageSrc: "/images/cicd/link.svg",
            imageAlt: "link logo",
          },
        },
        {
          text: "4. Then you can start building image by going to the",
          hasLink: true,
          link: {
            href: "http://localhost:3000/cicd/operation/operate",
            label: "Operation Page",
            imageSrc: "/images/cicd/link.svg",
            imageAlt: "link logo",
          },
        },
        {
          text: "**Note: the job for each operation will be listed in",
          hasLink: true,
          link: {
            href: "http://localhost:3000/cicd/operation/jobs",
            label: "Jobs List",
            imageSrc: "/images/cicd/link.svg",
            imageAlt: "link logo",
          },
        },
      ],
    },
  ];

  const services = [
    {
      name: "Image Services",
      path: "/cicd/images/projectSpaces",
      description:
        "Find your image that you have build, add registry and link to project and set the max worker for image builder here.",
    },
    {
      name: "Deployment Services",
      path: "/cicd/deployments",
      description:
        "See your deployed services and set the max worker for deployment operation here.",
    },
    {
      name: "Operate Service",
      path: "/cicd/operation/operate",
      description:
        "Build and deploy your services and all list of jobs that you had run.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-ci-bg-dark-blue px-16 py-8 flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-4 w-full items-center">
        <h2 className="text-3xl font-bold">Snapping Service CICD</h2>
        <div className="text-xl">
          Let's your build and deploy process easier.
        </div>
      </div>
      <hr className="border-t border-gray-300 col-span-6" />
      <div className="min-h-screen w-full bg-ci-bg-dark-blue flex flex-col gap-y-8">
        {topic.map(({ title, desc, content }, index) => (
          <div key={index} className="flex flex-col gap-y-4 w-full">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="text-base">{desc}</div>
            {index === 0 && (
              <div className="flex flex-row gap-x-4">
                {services.map(({ name, path, description }) => (
                  <div
                    key={name}
                    className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey rounded-lg w-1/3 cursor-pointer"
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
                  {hasLink ? (
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
