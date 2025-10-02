import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Snowflake, 
  Flame, 
  Fan, 
  Settings, 
  CheckCircle, 
  Zap 
} from "lucide-react";

const services = [
  {
    icon: Snowflake,
    title: "Air Conditioning",
    description: "Installation, repair, and maintenance of residential and commercial AC systems.",
    features: ["Central AC Installation", "AC Repair & Troubleshooting", "Preventive Maintenance", "Energy Efficiency Upgrades"]
  },
  {
    icon: Flame,
    title: "Heating Services",
    description: "Complete heating solutions to keep your space warm and comfortable.",
    features: ["Furnace Installation", "Heat Pump Services", "Boiler Repair", "Heating System Maintenance"]
  },
  {
    icon: Fan,
    title: "Ventilation",
    description: "Improve your indoor air quality with proper ventilation systems.",
    features: ["Ductwork Installation", "Air Duct Cleaning", "Ventilation Design", "Indoor Air Quality Testing"]
  },
  {
    icon: Settings,
    title: "System Maintenance",
    description: "Regular maintenance to keep your HVAC system running efficiently.",
    features: ["Seasonal Tune-ups", "Filter Replacement", "System Inspection", "Performance Optimization"]
  },
  {
    icon: Zap,
    title: "Emergency Repair",
    description: "24/7 emergency HVAC repair services when you need them most.",
    features: ["24/7 Availability", "Rapid Response", "Same-Day Service", "Emergency Diagnostics"]
  },
  {
    icon: CheckCircle,
    title: "New Installations",
    description: "Complete HVAC system design and installation for new construction.",
    features: ["System Design", "Equipment Selection", "Professional Installation", "Warranty Support"]
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            Our HVAC Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From installation to maintenance, we provide comprehensive HVAC solutions for homes and businesses across Abuja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-6 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}