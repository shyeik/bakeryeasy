import React from "react";
import CakeImage from "/blackforest.png"; // Replace with your actual image path
import Right from "../icons/Right"; // Replace with your Right icon component
import { Link } from "react-router-dom";
import SectionHeaders from "./SectionHeaders"; // Replace with your SectionHeaders component
import Custom from "../icons/Customize"; // Replace with your Customize icon component
import Menu from "./Cake"; // Replace with your Menu component
import About from "../Navbar/About"; // Replace with your About component

const Hero = () => {
  return (
    <>
      <section className="hero bg-secondary py-12 px-4 md:px-0">
        <div className="max-w-md mx-auto md:max-w-xl text-center md:text-left">
          <h1 className="font-Roboto font-bold text-3xl md:text-4xl leading-tight mb-4">
            Life’s sweeter
            <br />
            with a slice of
            <br />
            <span className="text-primary">Cake</span>
          </h1>
          <p className="my-4 text-gray-500 leading-relaxed">
            Cake is the sweet touch that <br />
            turns ordinary moments into delightful memories.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Link
              to="/customise"
              className="bg-white uppercase flex items-center gap-2 text-primary px-6 py-3 rounded-full w-full md:w-auto shadow-sm hover:shadow-md transition duration-300 justify-center"
            >
              Customize
              <Custom className="w-5 h-5" />
            </Link>
            <Link
              to="/cake"
              className="bg-primary uppercase flex items-center gap-2 text-white px-6 py-3 rounded-full w-full md:w-auto shadow-md hover:bg-primary-dark transition duration-300 justify-center"
            >
              Order now
              <Right className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="relative h-64 md:h-auto mt-8">
          <img
            src={CakeImage}
             width="200"
             height="200"
            className="object-contain w-full h-full"
            alt="cake"
          />
        </div>
      </section>

      <div className="mt-5 min-h-[40px]">
        <SectionHeaders />
      </div>

      <section className="bg-secondary py-16 min-h-[180px]">
        <div className="max-w-6xl mx-auto mb-2 px-4">
          <Menu />
        </div>
      </section>

      <div className="py-16 px-8 bg-white min-h-[120px]">
        <About />
      </div>
    </>
  );
};

export default Hero;

