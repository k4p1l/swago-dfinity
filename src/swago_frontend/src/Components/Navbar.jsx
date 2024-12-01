import logo from "../assets/images/logo.png";
import { Link as ScrollLink } from "react-scroll";
export const Navbar = () => {
  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="flex items-center justify-between py-1">
          <div className="relative">
            <div>
              <img
                src={logo}
                alt="logo"
                className="rounded-full w-[5rem] mix-blend-exclusion"
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-10 h-10 cursor-pointer sm:hidden hamburger">
            <ion-icon name="menu-sharp"></ion-icon>
          </div>
          <nav className="items-center hidden gap-6 sm:flex">
            <ScrollLink
              to="features"
              spy={true}
              smooth={true}
              duration={1000}
              className="text-white transition cursor-pointer text-opacity-60 hover:text-opacity-100"
            >
              Features
            </ScrollLink>

            <ScrollLink
              to="product"
              spy={true}
              smooth={true}
              duration={1000}
              className="text-white transition cursor-pointer text-opacity-60 hover:text-opacity-100"
            >
              Product
            </ScrollLink>
            <ScrollLink
              to="faqs"
              spy={true}
              smooth={true}
              duration={1000}
              className="text-white transition cursor-pointer text-opacity-60 hover:text-opacity-100"
            >
              FAQs
            </ScrollLink>

            <button className="px-4 py-2 bg-white rounded-lg">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
