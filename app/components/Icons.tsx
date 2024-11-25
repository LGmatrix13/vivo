interface IconProps {
  className?: string;
}

export function ArrowsSort(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 9l4 -4l4 4m-4 -4v14" />
      <path d="M21 15l-4 4l-4 -4m4 4v-14" />
    </svg>
  );
}

export function SortAscending(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l7 0" />
      <path d="M4 12l7 0" />
      <path d="M4 18l9 0" />
      <path d="M15 9l3 -3l3 3" />
      <path d="M18 6l0 12" />
    </svg>
  );
}

export function SortDescending(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l9 0" />
      <path d="M4 12l7 0" />
      <path d="M4 18l7 0" />
      <path d="M15 15l3 3l3 -3" />
      <path d="M18 6l0 12" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </svg>
  );
}

export function Download(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    </svg>
  );
}

export function FilePlus(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M12 11l0 6" />
      <path d="M9 14l6 0" />
    </svg>
  );
}

export function FileSearch(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M12 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v4.5"></path>
      <path d="M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"></path>
      <path d="M18.5 19.5l2.5 2.5"></path>
    </svg>
  );
}

export function User(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

export function File(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    </svg>
  );
}

export function Chart(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 18l0 -3" />
      <path d="M10 18l0 -6" />
      <path d="M14 18l0 -9" />
      <path d="M18 18l0 -12" />
    </svg>
  );
}

export function Pencil(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

export function Link(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 15l6 -6" />
      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    </svg>
  );
}

export function Home(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      strokeWidth="1.5"
    >
      <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
    </svg>
  );
}

export function HomeSearch(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-5 h-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      stroke-width="1.5"
    >
      <path d="M21 12l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h4.7"></path>
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2"></path>
      <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
      <path d="M20.2 20.2l1.8 1.8"></path>
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      stroke-width="1.5"
    >
      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"></path>
      <path d="M16 3v4"></path>
      <path d="M8 3v4"></path>
      <path d="M4 11h16"></path>
      <path d="M7 14h.013"></path>
      <path d="M10.01 14h.005"></path>
      <path d="M13.01 14h.005"></path>
      <path d="M16.015 14h.005"></path>
      <path d="M13.015 17h.005"></path>
      <path d="M7.01 17h.005"></path>
      <path d="M10.01 17h.005"></path>
    </svg>
  );
}

export function Logo() {
  return (
    <svg
      width="75"
      height="25"
      className="group"
      viewBox="0 0 75 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.95361 24.634L0 7.28404H7.28828L10.6349 17.4597L13.9816 7.28404H21.2699L14.3163 24.634H6.95361Z"
        fill="black"
      />
      <path
        d="M23.7953 4.97804V0H31.3438V4.97804H23.7953ZM24.353 24.634V12.2987H21.7873L22.3822 7.28404H31.3438V24.634H24.353Z"
        className="group-hover:fill-black duration-300 ease-in-out transition-all"
        fill="#2463EB"
      />
      <path
        d="M40.1805 24.634L33.2269 7.28404H40.5152L43.8618 17.4597L47.2085 7.28404H54.4968L47.5432 24.634H40.1805Z"
        fill="black"
      />
      <path
        d="M64.6254 25C61.1052 25 58.5022 24.2313 56.8165 22.694C55.1556 21.1567 54.3251 18.9117 54.3251 15.959C54.3251 13.0307 55.1679 10.798 56.8537 9.26062C58.5394 7.69888 61.13 6.91801 64.6254 6.91801C68.1455 6.91801 70.7485 7.69888 72.4342 9.26062C74.1447 10.798 75 13.0307 75 15.959C75 18.9117 74.1571 21.1567 72.4714 22.694C70.7857 24.2313 68.1703 25 64.6254 25ZM64.6254 19.9854C65.7657 19.9854 66.5838 19.6681 67.0796 19.0337C67.6002 18.3992 67.8605 17.3743 67.8605 15.959C67.8605 14.5681 67.6002 13.5554 67.0796 12.9209C66.5838 12.2621 65.7657 11.9327 64.6254 11.9327C63.5098 11.9327 62.7041 12.2621 62.2083 12.9209C61.7125 13.5554 61.4646 14.5681 61.4646 15.959C61.4646 17.3743 61.7125 18.3992 62.2083 19.0337C62.7041 19.6681 63.5098 19.9854 64.6254 19.9854Z"
        fill="black"
      />
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      stroke-width="1.5"
    >
      <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      stroke-width="1.5"
    >
      <path d="M12 5l0 14"></path>
      <path d="M5 12l14 0"></path>
    </svg>
  );
}

export function Loader(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${props.className || ""}`}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
      stroke-width="1.5"
    >
      <path d="M12 6l0 -3"></path>
      <path d="M16.25 7.75l2.15 -2.15"></path>
      <path d="M18 12l3 0"></path>
      <path d="M16.25 16.25l2.15 2.15"></path>
      <path d="M12 18l0 3"></path>
      <path d="M7.75 16.25l-2.15 2.15"></path>
      <path d="M6 12l-3 0"></path>
      <path d="M7.75 7.75l-2.15 -2.15"></path>
    </svg>
  );
}
