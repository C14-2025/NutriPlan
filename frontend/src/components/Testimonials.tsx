import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Adebayo Johnson",
    location: "Maitama, Abuja",
    rating: 5,
    text: "AMSUNO HVAC installed our new central air system last month. The team was professional, punctual, and the installation was flawless. Our home has never been more comfortable!"
  },
  {
    name: "Fatima Hassan",
    location: "Wuse II, Abuja",
    rating: 5,
    text: "When our AC broke down during the peak of dry season, AMSUNO HVAC came to our rescue within hours. Excellent emergency service and very reasonable pricing."
  },
  {
    name: "Michael Okafor",
    location: "Garki, Abuja",
    rating: 5,
    text: "I've been using AMSUNO HVAC for maintenance on our office building for 3 years. They're reliable, knowledgeable, and always deliver quality service. Highly recommended!"
  },
  {
    name: "Sarah Ibrahim",
    location: "Asokoro, Abuja",
    rating: 5,
    text: "The technicians were courteous and explained everything they were doing. The repair was completed quickly and our system is running better than ever. Great customer service!"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers across Abuja have to say about our HVAC services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="text-primary">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}