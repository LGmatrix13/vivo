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
      className={`flex items-center space-x-2 w-fit py-2 px-3 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out`}
    >
      <Icon />
      <span>{children}</span>
    </a>
  );
}
