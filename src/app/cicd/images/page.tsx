"use client";

import ContentManager from "@/components/cicd/ContentManager";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ImageHomePage() {
  const router = useRouter();

  const topic = [
    {
      title: "Available Services",
      desc: "Let's your build and deploy process easier.",
      services: [
        {
          name: "Image Services",
          path: "/cicd/images/projectSpaces",
          description:
            "Find your image that you have built, add registry and link to project and set the max worker for image builder here.",
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
      ],
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
            href: "http://localhost:3000/cicd/images/settings",
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

  return (
    <div className="min-h-screen w-full bg-ci-bg-dark-blue">
      <ContentManager topic={topic} />
    </div>
  );
}
