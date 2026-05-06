import React from 'react';
import './services.css';

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Organic Waste Recycling",
            description: "Turning organic waste into nutrient-rich compost for urban farming and green spaces.",
            image: "/img/service-1.jpg"
        },
        {
            id: 2,
            title: "Marine Waste Control",
            description: "Implementing smart systems to stop plastic waste from reaching our precious oceans.",
            image: "/img/service-2.jpg"
        },
        {
            id: 3,
            title: "Sustainable Disposal",
            description: "Moving beyond traditional landfills towards advanced 100% waste-to-energy solutions.",
            image: "/img/service-3.jpg"
        },
        {
            id: 4,
            title: "Ecosystem Preservation",
            description: "Ensuring waste management practices protect local wildlife and essential pollinators.",
            image: "/img/service-4.jpg"
        }
    ];

    return (
        <div className="container-fluid service py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Services</h5>
                    <h1 className="display-5 mb-0">Smart Waste Management Solutions</h1>
                </div>
                <div className="row g-4">
                    {services.map((service) => (
                        <div className="col-md-6 col-lg-3" key={service.id}>
                            <div className="service-item bg-light rounded h-100 shadow-sm overflow-hidden">
                                <div className="service-img">
                                    <img src={service.image} className="img-fluid w-100" alt={service.title} />
                                </div>
                                <div className="service-content text-center p-4">
                                    <h5 className="mb-3">{service.title}</h5>
                                    <p className="mb-0">{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
