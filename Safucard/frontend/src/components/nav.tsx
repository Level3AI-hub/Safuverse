import { FaChevronRight } from "react-icons/fa";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

export const Nav = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // make this relative so the absolute dropdown positions to it
    <nav className="relative flex pl-2 pr-5 lg:pr-2 py-1 bg-black rounded-full items-center">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => window.location.reload()}
      >
        <img src="/logo.png" className="h-14" />
        <h1 className="text-[#FFB000] text-2xl font-bold hidden md:flex">
          SAFU CARD
        </h1>
      </div>

      <div className="flex grow-1" />

      {/* desktop controls */}
      <div className="hidden lg:flex items-center gap-2 font-semibold lg:mr-2">
        <a
          href="https://x.com/Level3Lab"
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <button className="lg:flex px-20 py-3 bg-white hidden rounded-full cursor-pointer transition-all hover:scale-105 hover:bg-white/90 duration-300 delay-100">
            {" "}
            Community{" "}
          </button>
        </a>

        {openConnectModal && (
          <button
            onClick={openConnectModal}
            className="lg:flex items-center gap-20 py-1 px-2 pl-5 hidden bg-[#FFB000] rounded-full cursor-pointer transition-all hover:scale-105 hover:bg-[#FFB000]/90 duration-300"
          >
            {" "}
            <div className="flex">Login</div>{" "}
            <div className="bg-black flex rounded-full justify-center items-center p-3">
              {" "}
              <FaChevronRight className="text-[#FFB000]" />{" "}
            </div>{" "}
          </button>
        )}
      </div>
      {isConnected && (
        <div className="hidden lg:flex">
          <ConnectButton showBalance={true} />
        </div>
      )}

      {/* mobile hamburger */}
      {mobileMenuOpen ? (
        <HiOutlineX
          className="text-[#FFB000] text-4xl"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : (
        <button
          onClick={() => setMobileMenuOpen((s) => !s)}
          className="rounded-full lg:hidden p-3 px-4 bg-[#FFB000] flex flex-col items-center space-y-1 justify-center"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="h-[2px] rounded-full w-4 bg-black"></div>
          <div className="h-[2px] rounded-full w-4 bg-black"></div>
        </button>
      )}

      {/* mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full mt-3 z-50 px-4">
          <div className="w-full bg-black py-4 shadow-lg rounded-lg px-4">
            <div className="flex flex-col items-center space-y-4 px-10 font-semibold">
              <a
                href="https://x.com/Level3Lab"
                target="_blank"
                rel="noreferrer"
                className="w-full "
              >
                <button className="w-full px-4 py-3 bg-white rounded-full cursor-pointer transition-transform hover:scale-105">
                  Community
                </button>
              </a>

              {openConnectModal && (
                <button
                  onClick={() => {
                    openConnectModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 pl-10 py-3 bg-[#FFB000] rounded-full cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Login</span>
                  <div className="bg-black rounded-full p-2 flex items-center justify-center">
                    <FaChevronRight className="text-[#FFB000]" />
                  </div>
                </button>
              )}

              {isConnected ? (
                <div className="w-full px-4">
                  {/* ConnectButton renders its own UI — wrap it so it fills the width nicely */}
                  <div className="w-full rounded-full overflow-hidden">
                    <ConnectButton showBalance={true} />
                  </div>
                </div>
              ) : null}

              {/* optional: add a close button for clarity */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-sm text-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
