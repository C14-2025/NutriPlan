import { Card, CardContent } from "./ui/card";
import { Users, Award, MapPin, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const stats = [
    { icon: Users, number: "500+", label: "Happy Customers" },
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: MapPin, number: "50+", label: "Areas Served" },
    { icon: Clock, number: "24/7", label: "Emergency Service" }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6">
              About AMSUNO HVAC
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              For over 15 years, AMSUNO HVAC has been Abuja's trusted partner for all heating, ventilation, and air conditioning needs. We pride ourselves on delivering exceptional service, quality workmanship, and reliable solutions that keep our customers comfortable year-round.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our team of licensed and certified technicians brings extensive experience and expertise to every project. Whether you need emergency repairs, routine maintenance, or a complete system installation, we're committed to exceeding your expectations.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <CardContent className="p-0">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl text-primary mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional HVAC technicians at work"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}