import React, { useState } from 'react';

const Blog = () => {
    const [expandedPost, setExpandedPost] = useState(null);

    const posts = [
        {
            id: 1,
            title: "Save The Topic Forests",
            excerpt: "Learn about the importance of protecting our forest ecosystems and how you can help. Forests provide habitat for diverse wildlife and regulate our climate...",
            fullContent: "Forests are the lungs of our planet. They provide habitat for over 80% of terrestrial biodiversity and are crucial for the livelihoods of 1.6 billion people. Reforestation and protection of existing forests are vital steps in combating climate change and preserving nature for future generations. Join our community cleanup drives and reforestation programs to make a real difference.",
            date: "May 12, 2026",
            image: "/img/blog-1.jpg"
        },
        {
            id: 2,
            title: "Save The Topic Forests",
            excerpt: "Explore the impact of urban waste on local wildlife and reforestation efforts. As cities expand, the pressure on natural habitats increases...",
            fullContent: "Urban expansion often comes at a cost to the environment. Waste management becomes a critical challenge, and if not handled correctly, it leads to pollution of water bodies and destruction of animal habitats. Our smart waste monitoring systems and community awareness campaigns aim to bridge the gap between urban living and environmental sustainability.",
            date: "June 5, 2026",
            image: "/img/blog-2.jpg"
        },
        {
            id: 3,
            title: "Save The Topic Forests",
            excerpt: "Community-driven actions are the backbone of environmental restoration. When citizens take ownership of their local environment, change happens...",
            fullContent: "The power of the community is unmatched. From small plastic-free campaigns to large-scale cleanup drives, every action counts. We empower citizens with tools and knowledge to manage waste effectively at the source. By working together, we can ensure a cleaner, greener, and more sustainable future for everyone in our city.",
            date: "July 20, 2026",
            image: "/img/blog-3.jpg"
        },
        {
            id: 4,
            title: "Save The Topic Forests",
            excerpt: "How smart technology is revolutionizing waste management in modern cities. IoT and real-time tracking are changing the game...",
            fullContent: "Technology is a powerful ally in waste management. Our IoT-enabled smart bins track fill levels in real-time, optimizing collection routes and reducing fuel consumption. Data analytics help us understand waste patterns and improve system efficiency. This smart approach ensures that our city remains clean while minimizing our carbon footprint.",
            date: "August 15, 2026",
            image: "/img/blog-4.jpg"
        },
        {
            id: 5,
            title: "Save The Topic Forests",
            excerpt: "Sustainable living tips for a zero-waste lifestyle in a busy urban environment. Small changes in daily habits lead to big impacts...",
            fullContent: "Living a sustainable life doesn't have to be complicated. Start by segregating waste at home, using reusable bags, and avoiding single-use plastics. Composting organic waste can significantly reduce the amount of garbage sent to landfills. These small, consistent steps collective create a massive positive impact on our environment and inspire others to follow suit.",
            date: "September 10, 2026",
            image: "/img/blog-1.jpg"
        },
        {
            id: 6,
            title: "Save The Topic Forests",
            excerpt: "The role of public awareness in achieving long-term environmental goals. Education is the key to lasting behavioral change...",
            fullContent: "Awareness is the first step towards action. Through workshops, school programs, and public events, we educate citizens about the importance of proper waste disposal and recycling. When people understand the 'why' behind environmental protection, they are more likely to participate actively. Our goal is to build a well-informed and environmentally conscious society.",
            date: "October 5, 2026",
            image: "/img/blog-2.jpg"
        }
    ];

    return (
        <div className="container-fluid blog py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Blog</h5>
                    <h1 className="display-5 mb-0">Latest Stories & News</h1>
                </div>
                <div className="row g-4">
                    {posts.map(post => (
                        <div className="col-lg-4 col-md-6" key={post.id}>
                            <div className="blog-item bg-light rounded overflow-hidden shadow-sm h-100">
                                <div className="blog-img">
                                    <img src={post.image} className="img-fluid w-100" alt={post.title} style={{ height: '250px', objectFit: 'cover' }} />
                                </div>
                                <div className="blog-content p-4">
                                    <div className="d-flex mb-3 small text-muted">
                                        <i className="fa fa-calendar-alt text-primary me-2"></i>
                                        <span>{post.date}</span>
                                    </div>
                                    <h4 className="mb-3">{post.title}</h4>
                                    <p className="text-secondary small mb-4">
                                        {expandedPost === post.id ? post.fullContent : post.excerpt}
                                    </p>
                                    <button 
                                        className="btn btn-outline-primary rounded-pill px-4" 
                                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                    >
                                        {expandedPost === post.id ? "Read Less" : "Read More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
