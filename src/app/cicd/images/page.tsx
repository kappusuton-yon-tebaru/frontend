"use client";

import ContentManager from "@/components/cicd/ContentManager";

export default function ImageHomePage() {
  const header = {
    label: "Image Services",
    desc: "Manage you images and registry here.",
  };

  const topic = [
    {
      title: "Available Services",
      desc: "",
      services: [
        {
          name: "Services List",
          path: "/cicd/images/projectSpaces",
          description:
            "You can see list of services that can be use to build image and also all images of service that you have built.",
        },
        {
          name: "Registry List",
          path: "/cicd/images/registry",
          description:
            "Manage your registry provider and bind it into project here.",
        },
        {
          name: "Image Setting",
          path: "/cicd/images/settings",
          description:
            "Adjust the maximum worker for image building at your preference.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-ci-bg-dark-blue">
      <ContentManager header={header} topic={topic} />
    </div>
  );
}
