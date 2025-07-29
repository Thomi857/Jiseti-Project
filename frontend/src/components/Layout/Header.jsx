// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { 
//   Bars3Icon, 
//   XMarkIcon, 
//   UserCircleIcon,
//   FlagIcon
// } from '@heroicons/react/24/outline';

// const Header = () => {
//   const { user, logout, isAuthenticated, isAdmin } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setMobileMenuOpen(false);
//   };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <FlagIcon className="h-8 w-8 text-primary-600" />
//             <span className="text-xl font-bold text-gray-900">Jiseti</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link 
//               to="/" 
//               className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
//             >
//               Reports
//             </Link>
            
//             {isAuthenticated && (
//               <>
//                 <Link 
//                   to="/create-report" 
//                   className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   Create Report
//                 </Link>
                
//                 {isAdmin && (
//                   <Link 
//                     to="/admin" 
//                     className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
//                   >
//                     Admin Panel
//                   </Link>
//                 )}
//               </>
//             )}

//             {/* User Menu */}
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2">
//                   <UserCircleIcon className="h-6 w-6 text-gray-400" />
//                   <span className="text-sm text-gray-700">{user.username}</span>
//                   {isAdmin && (
//                     <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
//                       Admin
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link 
//                   to="/login" 
//                   className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/register" 
//                   className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? (
//               <XMarkIcon className="h-6 w-6 text-gray-600" />
//             ) : (
//               <Bars3Icon className="h-6 w-6 text-gray-600" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
//               <Link 
//                 to="/" 
//                 className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Reports
//               </Link>
              
//               {isAuthenticated && (
//                 <>
//                   <Link 
//                     to="/create-report" 
//                     className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Create Report
//                   </Link>
                  
//                   {isAdmin && (
//                     <Link 
//                       to="/admin" 
//                       className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       Admin Panel
//                     </Link>
//                   )}
                  
//                   <div className="px-3 py-2 flex items-center space-x-2">
//                     <UserCircleIcon className="h-5 w-5 text-gray-400" />
//                     <span className="text-sm text-gray-700">{user.username}</span>
//                     {isAdmin && (
//                       <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
//                         Admin
//                       </span>
//                     )}
//                   </div>
                  
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )}

//               {!isAuthenticated && (
//                 <>
//                   <Link 
//                     to="/login" 
//                     className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link 
//                     to="/register" 
//                     className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  // FlagIcon, // You can remove FlagIcon if you're no longer using it
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { GiStaticGuard } from "react-icons/gi";

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-jisefi-green-dark py-4 shadow-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Updated to use GiStaticGuard icon */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl">
            <GiStaticGuard className="h-10 w-auto text-white" /> 
            <span className="text-3xl font-extrabold text-white">Jiseti</span>
            <span className="text-xs font-medium text-white/80 relative top-1">Truth & Transparency</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              // Text color changed to white, hover changed to jisefi-yellow-accent
              className="text-white font-medium hover:text-jisefi-yellow-accent relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-jisefi-yellow-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Reports
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/create-report"
                  // Button background color changed to jisefi-yellow-accent
                  className="px-4 py-2 bg-jisefi-yellow-accent text-jisefi-green-dark rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all duration-300"
                >
                  Create Report
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    // Text color changed to white, hover changed to jisefi-yellow-accent
                    className="text-white font-medium hover:text-jisefi-yellow-accent relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-jisefi-yellow-accent after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-white/60" /> {/* Icon color changed to white/60 */}
                  <span className="text-sm text-white">{user?.username || user?.email || 'User'}</span> {/* Text color changed to white */}
                  {isAdmin && (
                    // Admin badge colors adjusted for dark background
                    <span className="bg-jisefi-yellow-accent/20 text-jisefi-yellow-accent text-xs px-2 py-1 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  // Outline button colors adjusted for dark background
                  className="px-3 py-2 border border-white text-white rounded-lg text-sm font-semibold hover:bg-white hover:text-jisefi-green-dark transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  // Outline button colors adjusted for dark background
                  className="px-3 py-2 border border-white text-white rounded-lg text-sm font-semibold hover:bg-white hover:text-jisefi-green-dark transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  // Primary button colors adjusted for dark background
                  className="px-3 py-2 bg-jisefi-yellow-accent text-jisefi-green-dark rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            // Icon color changed to white
            className="md:hidden text-white hover:text-jisefi-yellow-accent transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Navigation (background remains white for contrast when open) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-jisefi-light-grey pb-4">
            <div className="px-2 pt-2 pb-3 space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-jisefi-dark-grey hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reports
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/create-report"
                    className="block px-3 py-2 text-base font-medium text-jisefi-green-dark hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Report
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-jisefi-dark-grey hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <div className="px-3 py-2 flex items-center space-x-2 border-t border-jisefi-light-grey pt-2 mt-2">
                    <UserCircleIcon className="h-6 w-6 text-jisefi-dark-grey/60" />
                    <span className="text-base text-jisefi-dark-grey">{user?.username || user?.email || 'User'}</span>
                    {isAdmin && (
                      <span className="bg-jisefi-green-light/10 text-jisefi-green-dark text-xs px-2 py-1 rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-jisefi-dark-grey hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-jisefi-dark-grey hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-jisefi-green-dark hover:bg-jisefi-off-white hover:text-jisefi-green-dark rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;