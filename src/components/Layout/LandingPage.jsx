import React from "react";
import CakeImage from "/cake.png";
import Right from "../icons/Right";
import { Link } from "react-router-dom";
import SectionHeaders from "./SectionHeaders";
import Custom from "../icons/Customize";
import Menu from "./Cake";

const LandingPage = () => {
  return (
    <>
      <section className="hero ">
        <div className="py-12 ">
          <div>
            <h1
              className="font-Roboto font-semibold
            text-4xl"
            >
              Life’s sweeter
              <br /> with a slice of
              <br /> <span className="text-primary">Cake</span>
            </h1>
            <p className=" my-4 text-gray-500">
              Cake is the missing pieace that <br />
              makes every day complete, a simple yet delicious joy in life
            </p>
            <div className="font-Roboto flex gap-4 text-sm">
              <Link
                to="/customise"
                className="bg-white uppercase flex items-center gap-2 text-primary px-4 py-2 rounded-full"
              >
                Customize
                <Custom />
              </Link>
              <button className="flex gap-2 px-3 py-2 border-primary border rounded-full bg-primary text-white font-medium text-fontFamily-Roboto-0">
                Order now
                <Right />
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src={CakeImage}
            layout={"fill"}
            object-fit={"contain"}
            alt={"cake"}
          />
        </div>
      </section>

      <SectionHeaders />

      <Menu />
    </>
  );
};

export default LandingPage;
