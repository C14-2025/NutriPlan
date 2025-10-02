import { Separator } from "./ui/separator";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl mb-4">
              <span className="text-white">AMSUNO</span>
              <span className="text-blue-400 ml-2">HVAC</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted HVAC partner in Abuja. We provide professional heating, ventilation, and air conditioning services with a commitment to excellence and customer satisfaction.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3" />
                <span>08064206913</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3" />
                <span>info@amsunohvac.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3" />
                <span>107 Gbagalape, Abuja 900103, FCT</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Air Conditioning</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Heating Services</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Ventilation</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Maintenance</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Emergency Repair</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Installation</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
            
            <h4 className="text-lg mt-6 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 AMSUNO HVAC. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-300 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">License Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}