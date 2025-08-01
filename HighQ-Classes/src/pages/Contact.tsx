


import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="w-full">
      {/* ✅ Top Section */}
      <div className="bg-[#07116d] text-white py-10 px-4 md:px-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-orange-500">Contact Us</h2>
          <p className="text-lg">
            We're here to answer any question you might have. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="bg-[#eaf0ff] py-12 px-4 md:px-20">
        <div className="grid md:grid-cols-3 gap-6 text-[#07116d]">
          {[
            {
              title: "Existing customers",
              desc: "Already bank with us? Our customer support team will be able to answer your questions.",
            },
            {
              title: "New savings customers",
              desc: "Looking to open a business or personal savings account? Speak to our accounts team.",
            },
            {
              title: "New business finance customers",
              desc: "Are you a business interested in a commercial mortgage or asset finance? We'll connect you with a relationship manager.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="mb-4 text-sm">{card.desc}</p>
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Contact us →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form + Business Hours */}
      <div className="px-4 py-10 md:px-20 bg-[#f3f1fd] text-[#07116d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-orange-500">CONTACT US</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Form */}
          <form className="bg-white p-6 rounded-xl shadow space-y-4">
            <Input type="text" placeholder="Full Name" className="text-[#07116d]" />
            <Input type="email" placeholder="Email" className="text-[#07116d]" />
            <Input type="tel" placeholder="Phone" className="text-[#07116d]" />
            <Input type="text" placeholder="Subject" className="text-[#07116d]" />
            <Textarea
              placeholder="Your comment or query"
              className="min-h-[100px] text-[#07116d]"
            />
            <Button type="submit" className="bg-[#07116d] text-white w-full">
              Submit
            </Button>
            <p className="text-sm text-center text-gray-600">
              You can also contact us at +91-9871111122
            </p>
          </form>

          {/* Right: Business Hours */}
          <div className="bg-[#e0e7ff] border border-gray-200 p-6 rounded-xl shadow text-[#07116d]">
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-md">
              <li>
                <strong>Monday – Friday:</strong> 8:00 AM – 8:00 PM
              </li>
              <li>
                <strong>Saturday:</strong> 9:00 AM – 6:00 PM
              </li>
              <li>
                <strong>Sunday:</strong> Closed
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="px-4 pb-12 md:px-20 bg-white">
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.896272641253!2d75.80073437413873!3d26.839607376686667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5eeb88d6e2b%3A0xfa3db42e7b7a5a90!2sRajasthan!5e0!3m2!1sen!2sin!4v1620913501860!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}





