import React from 'react';
import './causes.css';

const Causes = () => {
    const causes = [
        {
            id: 1,
            title: "Garbage Cleanup Drive",
            description: "Organizing massive cleanup drives in urban areas to ensure a cleaner and healthier environment.",
            goal: "$5000",
            raised: "$3200",
            image: "/img/causes-1.jpg",
            progress: 64
        },
        {
            id: 2,
            title: "Plastic Free Campaign",
            description: "Promoting the reduction of single-use plastics and encouraging sustainable alternatives.",
            goal: "$5000",
            raised: "$3200",
            image: "/img/causes-2.jpg",
            progress: 64
        },
        {
            id: 3,
            title: "Smart Waste Bins",
            description: "Deploying IoT-enabled smart bins across the city for optimized waste collection routes.",
            goal: "$5000",
            raised: "$3200",
            image: "/img/causes-3.jpg",
            progress: 64
        },
        {
            id: 4,
            title: "Community Awareness",
            description: "Empowering citizens with knowledge about waste segregation and environmental protection.",
            goal: "$5000",
            raised: "$3200",
            image: "/img/causes-4.jpg",
            progress: 64
        }
    ];

    return (
        <div className="container-fluid causes py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Causes</h5>
                    <h1 className="display-5 mb-0">Support Our Environmental Initiatives</h1>
                </div>
                <div className="row g-4">
                    {causes.map((cause) => (
                        <div className="col-lg-6 col-xl-3" key={cause.id}>
                            <div className="causes-item bg-light rounded overflow-hidden shadow-sm h-100">
                                <div className="causes-img">
                                    <img src={cause.image} className="img-fluid w-100" alt={cause.title} />
                                </div>
                                <div className="causes-content p-4">
                                    <h5 className="mb-3">{cause.title}</h5>
                                    <p className="text-secondary small mb-4">{cause.description}</p>
                                    <div className="progress rounded-pill mb-2" style={{ height: '10px' }}>
                                        <div 
                                            className="progress-bar bg-primary" 
                                            role="progressbar" 
                                            style={{ width: `${cause.progress}%` }} 
                                            aria-valuenow={cause.progress} 
                                            aria-valuemin="0" 
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between small fw-bold">
                                        <span>Goal: {cause.goal}</span>
                                        <span>Raised: {cause.raised}</span>
                                    </div>
                                </div>
                                <div className="causes-btn p-4 pt-0">
                                    <a className="btn btn-outline-primary w-100 rounded-pill px-4" href="#">Support Now</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Causes;
