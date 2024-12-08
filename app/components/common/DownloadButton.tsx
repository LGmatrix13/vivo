import React from "react";

interface DownloadButtonProps {
  Icon: (props: any) => React.ReactElement;
  file: string;
  children: React.ReactNode;
}

export default function DownloadButton(props: DownloadButtonProps) {
  const { children, Icon, file } = props;
  return (
    <a
      href={`/${file}`}
      className={`flex items-center space-x-2 w-fit py-2 px-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition ease-in-out`}
    >
      <Icon />
      <span>{children}</span>
    </a>
  );
}
