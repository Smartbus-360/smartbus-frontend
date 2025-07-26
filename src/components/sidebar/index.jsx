import { HiX } from "react-icons/hi";
import Logo from "../../assets/img/logo.png";
import Links from "./components/Links";
import routes from "../../routes";

const Sidebar = ({ open, onClose }) => {
  const sidebarRoutes = routes();
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex flex-col h-screen bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className="mx-[56px] mt-[10px] text-center space-x-2">
        <img src={Logo} alt="Logo" className="max-w-20 m-auto" />
        <div className="font-poppins m-0 text-xl font-bold uppercase text-navy-700 dark:text-white">
          Smart Bus 360
        </div>
      </div>

      <div className="mt-[16px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

      {/* Nav items inside a scrollable container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <ul className="mb-auto pt-1">
          <Links routes={sidebarRoutes} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
