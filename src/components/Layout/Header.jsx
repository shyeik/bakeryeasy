import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import Menu from "../../assets/outlinemenu.svg";
import Home from "../../assets/home.svg";
import Menus from "../../assets/menu.svg";
import Logout from "../../assets/logout.svg";
import Reward from "../../assets/reward.svg";
import IN from "../../assets/login.svg";
import { Tooltip } from "react-tooltip";

import { useCart } from "../CartContext";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { setCartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedID = localStorage.getItem("id");
    const image = localStorage.getItem("image");

    if (token && storedName && storedID) {
      setUser({
        name: storedName,
        image: image,
        id: storedID,
      });
      setIsAuthenticated(true);
    } else {
      const queryParams = new URLSearchParams(window.location.search);
      const googleToken = queryParams.get("token");
      const googleName = queryParams.get("name");
      const googleId = queryParams.get("id");
      if (googleToken && googleName && googleId) {
        localStorage.setItem("token", googleToken);
        localStorage.setItem("name", googleName);
        localStorage.setItem("id", googleId);
        setUser({
          name: googleName,
          id: googleId,
        });
        setIsAuthenticated(true);

        navigate("/hero");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, [navigate, setCartItems]); // Add setCartItems to dependency array

  const handleLogout = () => {
    navigate("/hero");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  const handleGoToCart = () => {
    navigate("/cart");
    window.location.reload();
  };

  const handleGoToOrder = () => {
    navigate("/order");
    window.location.reload();
  };

  const handleGoToReward = () => {
    navigate("/reward");
    window.location.reload();
  };

  const toggleLogin = () => setShowLogin((prev) => !prev);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <header className="sticky top-0 z-10 w-full bg-secondary p-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <button className="lg:hidden text-2xl" onClick={toggleSidebar}>
            <img src={Menu} alt="menu icon" width="24" height="24" />
          </button>
          <div className="flex-grow text-center lg:flex-grow-0 lg:text-left">
            <Link
              to={isAuthenticated ? "/hero" : "/hero"}
              className="text-2xl font-semibold text-primary"
            >
              BAKERY EASY
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex gap-x-12">
          <Link
            to="/hero"
            className="text-black text-lg font-semibold"
            title="Home"
          >
            Home
          </Link>
          <Link
            to="/cake"
            className="text-black text-lg font-semibold"
            title="Cakes"
          >
            Cakes
          </Link>
          <Link
            to="/about"
            className="text-black text-lg font-semibold"
            title="About"
          >
            About
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="hidden lg:flex items-center justify-center">
            <Link onClick={handleGoToCart} className="-mr-8" title="Cart">
              <img src="/cakecart.png" alt="cart icon" width="65" height="65" />
            </Link>
            <Link onClick={handleGoToOrder} className="-mr-4 ml-8">
              <img
                src="/checklist.png"
                alt="checklist icon"
                width="30"
                height="30"
              />
            </Link>
            <Link onClick={handleGoToReward} className="-mr-4 ml-8">
              <img src={Reward} alt="checklist icon" width="30" height="30" />
            </Link>

            <span className="ml-8 mr-5 text-md font-semibold" title="User Info">
              Hello, {user?.name || "Guest"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-primary text-white font-extrabold px-8 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center">
            <button className="mr-4" onClick={toggleLogin} title="Login">
              <span className="bg-primary text-white font-extrabold px-8 py-2 rounded-full w-full">
                Login
              </span>
            </button>
          </div>
        )}
      </nav>

      {showSidebar && (
        <div className="fixed inset-0 flex lg:hidden z-50">
          <div className="fixed inset-y-0 left-0 w-15 max-w-xs bg-red-300 shadow-lg transform translate-x-0 transition-transform duration-300 z-50">
            <div className="flex items-center justify-between p-4">
              <button onClick={toggleSidebar} title="Close Menu">
                {/* No need for a close icon here */}
              </button>
            </div>
            <div className="flex flex-col items-start p-4 gap-4">
              <Tooltip id="my-tooltip" />
              <Link
                to="/hero"
                onClick={toggleSidebar}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Home"
                className="text-cyan-400"
              >
                <img src={Home} alt="home icon" width="24" height="32" />
              </Link>
              <Link
                to="/cake"
                onClick={toggleSidebar}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Cake"
              >
                <img src={Menus} alt="menu icon" width="24" height="32" />
              </Link>
              <Link
                to="/about"
                onClick={toggleSidebar}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="About"
              >
                <img src="/about.png" alt="about icon" width="24" height="32" />
              </Link>

              {isAuthenticated ? (
                <div className="w-full">
                  <Link
                    to="/cart"
                    onClick={() => {
                      handleGoToCart();
                      toggleSidebar();
                    }}
                    className="flex -ml-3.5 items-center gap-2 text-primary "
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Cart"
                  >
                    <img
                      src="/cakecart.png"
                      alt="cart icon"
                      width="50"
                      height="50"
                    />
                  </Link>
                  <Link
                    to="/order"
                    onClick={() => {
                      handleGoToOrder();
                      toggleSidebar();
                    }}
                    className="flex ml-1 mt-3 items-center gap-2 text-primary"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Orders"
                  >
                    <img
                      src="/checklist.png"
                      alt="checklist icon"
                      width="25"
                      height="30"
                    />
                  </Link>
                  <Link
                    to="/reward"
                    onClick={() => {
                      handleGoToReward();
                      toggleSidebar();
                    }}
                    className="flex ml-0 mt-3 items-center gap-2 text-primary "
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Reward"
                  >
                    <img src={Reward} alt="cart icon" width="30" height="50" />
                  </Link>

                  <button
                    className="mt-4"
                    onClick={() => {
                      handleLogout();
                      toggleSidebar();
                    }}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Logout"
                  >
                    <img
                      src={Logout}
                      alt="logout icon"
                      width="25"
                      height="20"
                    />
                  </button>
                </div>
              ) : (
                <button
                  className=""
                  onClick={() => {
                    toggleLogin();
                    toggleSidebar();
                  }}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Login"
                >
                  <img src={IN} alt="login icon" width="25" height="20" />
                </button>
              )}
            </div>
          </div>
          <div className="bg-black opacity-50 w-full" onClick={toggleSidebar} />
        </div>
      )}

      {showLogin && (
        <Login
          onLoginSuccess={(user) => {
            localStorage.setItem("token", user.token);
            localStorage.setItem("name", user.name);
            localStorage.setItem("id", user.id);
            setIsAuthenticated(true);
            setUser(user);
            setShowLogin(false);
            window.location.reload();
            // fetchCartItems(user.id); // Fetch cart for the new user
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </header>
  );
}
