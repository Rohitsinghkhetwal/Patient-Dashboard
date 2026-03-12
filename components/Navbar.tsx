
import React from "react";

interface PatientDirectoryNavbarProps {
  title?: string;
  patientCount?: number;
}

type CrossType = "normal" | "bright" | "dim" | "empty";

const crossPattern: CrossType[] = [
  "empty", "empty",  "empty",  "normal", "normal", "bright", "normal", "dim",    "normal", "bright",
  "empty", "empty",  "normal", "dim",    "bright", "normal", "normal", "bright", "dim",    "normal",
  "empty", "normal", "dim",    "normal", "normal", "dim",    "bright", "normal", "normal", "dim",
  "empty", "empty",  "normal", "bright", "dim",    "normal", "dim",    "normal", "bright", "normal",
];

const crossClass: Record<CrossType, string> = {
  normal: "text-white/[.22] text-[28px]",
  bright: "text-white/[.45] text-[26px]",
  dim:    "text-white/[.10] text-[24px]",
  empty:  "text-transparent text-[28px]",
};

const Navbar: React.FC<PatientDirectoryNavbarProps> = ({
  title = "Patient Directory",
  patientCount = 1000,
}) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="
          relative w-full overflow-hidden
          flex flex-col justify-center
          min-h-[88px] px-7 py-[22px]
          bg-[linear-gradient(100deg,_#3b7ef8_0%,_#2f6de8_40%,_#2563eb_100%)]
          font-[DM_Sans,sans-serif]
        "
      >
        <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden pointer-events-none">
          <div
            className="
              absolute top-[-10px] right-[-10px]
              w-[110%] h-[120%]
              grid gap-0
              -rotate-[4deg]
            "
            style={{
              gridTemplateColumns: "repeat(10, 44px)",
              gridTemplateRows:    "repeat(4, 44px)",
            }}
          >
            {crossPattern.map((type, i) => (
              <span
                key={i}
                className={`
                  flex items-center justify-center
                  font-light leading-none select-none
                  ${crossClass[type]}
                `}
              >
                +
              </span>
            ))}
          </div>
        </div>

        <h1
          className="
            relative z-10
            m-0 leading-tight tracking-[-0.2px]
            text-white text-2xl font-bold
          "
        >
          {title}
        </h1>
        <p
          className="
            relative z-10
            mt-[5px] mb-0
            text-white/70 text-[13px] font-normal
          "
        >
          {patientCount.toLocaleString()} Patient Found
        </p>

      </div>
    </>
  );
};

export default Navbar;