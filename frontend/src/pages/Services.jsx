import React from 'react';
import './services.css';

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Waste Collection",
            description: "Efficient door-to-door garbage collection ensuring cleanliness across all zones.",
            image: "/img/service-1.jpg"
        },
        {
            id: 2,
            title: "Recycling Management",
            description: "Smart segregation and recycling system for plastic, organic, and hazardous waste.",
            image: "/img/service-2.jpg"
        },
        {
            id: 3,
            title: "Smart Monitoring",
            description: "Real-time tracking of waste levels and worker activities using smart technology.",
            image: "/img/service-3.jpg"
        },
        {
            id: 4,
            title: "Public Awareness",
            description: "Educating citizens about proper waste disposal and environmental responsibility.",
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
