import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-3 mt-6">
      <p>Desarrollado por <strong>Sergio Mario Boada Miranda</strong> | {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
