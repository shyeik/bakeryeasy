const AboutUs = () => {
  return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start">
        {/* Image Section */}
        <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-6 md:mb-0">
          <img
            src="/logoeasy.png" // Replace with actual image URL
            alt="Bakery About Us"
            width="240" height="200" className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Us
          </h2>
          <p className="text-gray-700 mb-4">
            At <span className="text-primary font-semibold">BAKERY EASY</span>,
            we bring sweetness to every occasion with premium cakes and pastries
            crafted with care.
          </p>
          <div className="text-lg text-gray-800 font-semibold mb-4 space-y-2">
            <p>📍 Address: Sorsogon, Sorsogon City</p>
            <p>📞 Contact: +63 994 456 7890</p>
            <p>✉️ Email: 3d@bakeryeasy.com</p>
          </div>
          <p className="text-gray-600">
            Visit us to make your celebrations unforgettable!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

