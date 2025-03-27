import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  Chart,
  File,
  Home,
  Logo,
  Sparkles,
  User,
} from "~/components/common/Icons";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo" },
    { name: "Vivo", content: "Residence Life, Centralized" },
  ];
};

export default function Index() {
  return (
    <>
      <div className="bg-blue-600 h-12 justify-center text-white flex items-center">
        <div className="flex items-center space-x-2 px-10 truncate">
          <Sparkles />
          <span className="truncate">
            Try "Ask Merrick" to get quick answers on your Residence Life
            documentation
          </span>
        </div>
      </div>
      <nav className="flex items-center justify-between border-gray-300 border-b px-10 py-7">
        <Logo />
        <Link to="/auth/login">
          <span className="font-bold">Login</span>
        </Link>
      </nav>
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7 text-lg">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-center space-y-3 my-40 max-w-[600px] mx-auto">
            <h1 className="text-4xl font-bold">
              Effortless organization
              <br />
              and Collaboration
            </h1>
            <p>
              Reporting, people management, housing management, and insights for
              your residence life community in one place.
            </p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg divide-y divide-gray-300">
          <div className="p-7 space-y-3">
            <div className="space-x-2 flex items-center">
              <File className="w-7 h-7" />
              <h2 className="font-bold text-xl">Reporting made easy </h2>
            </div>
            <p>
              Streamlined tracking of conversations, staff health, events,
              violations, and round reports by centralizing reporting in one
              place. Automatic insights are generated from reports, providing a
              clear, at-a-glance understanding of key trends.
            </p>
          </div>
          <div className="p-7 space-y-3">
            <div className="space-x-2 flex items-center">
              <User className="w-7 h-7" />
              <h2 className="font-bold text-xl">
                People management made easy{" "}
              </h2>
            </div>
            <p>
              Assign residents to halls and rooms while ensuring that Resident
              Assistants and Resident Directors can only view and manage the
              residents within their designated scope. Structured access control
              to maintain organization and privacy.
            </p>
          </div>
          <div className="p-7 space-y-3">
            <div className="space-x-2 flex items-center">
              <Home className="w-7 h-7" />
              <h2 className="font-bold text-xl">
                Housing management made easy{" "}
              </h2>
            </div>
            <p>
              An always seamless check-in and check-out process. Fully digital
              RCIs. Integrates directly with Limble, enabling automatic work
              order creation for maintenance and repairs.
            </p>
          </div>
          <div className="p-7 space-y-3">
            <div className="space-x-2 flex items-center">
              <Chart className="w-7 h-7" />
              <h2 className="font-bold text-xl">Insights made easy </h2>
            </div>
            <div>
              Transforms reports into actionable insights, identifying residents
              who need more engagement and uncovering inefficiencies in
              residence life operations. By analyzing data in real-time, it
              enables proactive decision-making to enhance community experiences
              and operational efficiency.
            </div>
          </div>
          <div className="p-7 space-y-3">
            <div className="space-x-2 flex items-center">
              <Sparkles className="w-7 h-7" />
              <h2 className="font-bold text-xl">Quick answers</h2>
            </div>
            <div>
              Get quick answers by asking Merrick, an interactive AI chatbot
              trained on the Crimson and Resident Life Manual. Merrick provides
              instant guidance on policies and procedures, making it easy to
              find the information you need.
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t px-10 py-7">
        <span className="font-bold">Vivo © {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
