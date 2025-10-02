import { Button } from "./ui/button";
import { Shield, Clock, Wrench } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Professional HVAC Services in <span className="text-blue-600">Abuja</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Keep your home and business comfortable year-round with our expert heating, ventilation, and air conditioning services. Licensed, insured, and trusted by Abuja residents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Schedule Service
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Emergency Service
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Licensed & Insured</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">24/7 Emergency</p>
              </div>
              <div className="text-center">
                <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Expert Technicians</p>
              </div>
            </div>
          </div>

          <div className="lg:text-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="HVAC technician working on air conditioning unit"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}