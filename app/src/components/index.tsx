import * as React from "react";
// TODO Split these into separate files. For now, it's convenient to have them all in one place.

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white">
    {children}
  </div>
);

export const Button = ({ children, ...props }: any) => (
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full my-2"
    type="button"
    {...props}
  >
    {children}
  </button>
);

export const Logo = () => <img src="../img/MindfulDataAILogoOG.png" />;
