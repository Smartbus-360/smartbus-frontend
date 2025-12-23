// const Footer = () => {
//   return (
//     <div className="flex w-full flex-col items-center text-center px-1 pb-8 pt-3 lg:px-8">
//       <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
//         <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
//           ©  Smart Bus 360. All Rights Reserved.
//         </p>
//       </h5>
//     </div>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full text-center px-4 pb-8 pt-4 text-sm text-gray-600">
      <div className="flex flex-wrap justify-center gap-4 mb-3">
        <Link to="/home/refund-policy">Refund Policy</Link>
        <Link to="/home/shipping-policy">Shipping Policy</Link>
        <Link to="/home/privacy-policy">Privacy Policy</Link>
        <Link to="/home/terms-and-conditions">Terms & Conditions</Link>
        <Link to="/home/contact-us">Contact Us</Link>
      </div>

      <p>© SMARTBUS360. All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
