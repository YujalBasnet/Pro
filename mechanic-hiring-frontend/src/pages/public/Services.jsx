import ServiceCard from "../../components/cards/ServiceCard";

const services = [
  { id: 1, name: "Engine Repair", description: "Professional engine repair services", image: "/assets/images/service1.jpg" },
  { id: 2, name: "Oil Change", description: "Quick and affordable oil change", image: "/assets/images/service2.jpg" },
  { id: 3, name: "Tire Replacement", description: "High-quality tire replacement", image: "/assets/images/service3.jpg" },
  { id: 4, name: "Brake Services", description: "Brake maintenance and repair", image: "/assets/images/service4.jpg" },
];

const Services = () => (
  <div className="px-8 py-16">
    <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  </div>
);

export default Services;