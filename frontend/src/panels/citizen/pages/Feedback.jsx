import React, { useState, useEffect } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingFeedback, setEditingFeedback] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        setFeedbacks(saved);
    }, []);

    const handleAddOrUpdate = (data) => {
        let updated;
        if (editingFeedback) {
            updated = feedbacks.map(f => f.id === editingFeedback.id ? { ...data, id: f.id } : f);
            setEditingFeedback(null);
            alert("Feedback updated!");
        } else {
            const newFeedback = { ...data, id: Date.now() };
            updated = [newFeedback, ...feedbacks];
            alert("Feedback submitted!");
        }
        localStorage.setItem("feedbacks", JSON.stringify(updated));
        setFeedbacks(updated);
    };

    const handleDelete = (id) => {
        if (window.confirm("Remove this feedback?")) {
            const updated = feedbacks.filter(f => f.id !== id);
            localStorage.setItem("feedbacks", JSON.stringify(updated));
            setFeedbacks(updated);
        }
    };

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4">
                <h2 className="fw-bold">Citizen Feedback</h2>
                <p className="text-muted">Your thoughts help us improve the city's cleanliness.</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-5">
                    <FeedbackForm onSubmit={handleAddOrUpdate} initialData={editingFeedback} />
                    {editingFeedback && (
                        <button className="btn btn-link small text-muted mt-2" onClick={() => setEditingFeedback(null)}>Cancel Edit</button>
                    )}
                </div>
                <div className="col-lg-7">
                    <div className="dashboard-card p-4 shadow-sm">
                        <h6 className="fw-bold mb-4">Recent Feedback</h6>
                        <FeedbackList 
                            feedbacks={feedbacks} 
                            onEdit={setEditingFeedback} 
                            onDelete={handleDelete} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;