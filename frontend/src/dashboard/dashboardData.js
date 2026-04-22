export const initialWorkers = [
    { id: 1, name: "Rahul Sharma", contact: "9876543210", schedule: "08:00 AM - 04:00 PM", role: "Driver", status: "Active", dutyStatus: "On Duty", area: "North Zone" },
    { id: 2, name: "Anita Devi", contact: "9876543211", schedule: "06:00 AM - 02:00 PM", role: "Sweeper", status: "Active", dutyStatus: "On Duty", area: "East Zone" },
    { id: 3, name: "Amit Kumar", contact: "9876543212", schedule: "10:00 AM - 06:00 PM", role: "Collector", status: "Inactive", dutyStatus: "Off Duty", area: "West Zone" }
];

export const initialMcRecords = [
    { id: 1, name: "North Municipal Corp", head: "Mr. Khanna", zone: "North" },
    { id: 2, name: "South Municipal Corp", head: "Mrs. Reddy", zone: "South" }
];

export const initialAreaRecords = [
    { id: 1, name: "Park Avenue", zone: "North", cleanliness: "High" },
    { id: 2, name: "Metro Colony", zone: "East", cleanliness: "Medium" }
];

export const initialCitizenRecords = [
    { id: 1, name: "Suresh Raina", email: "suresh@example.com", reports: 5, location: "North Delhi, Sector 4" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", reports: 2, location: "West Mumbai, Bandra" }
];

export const initialComplaints = [
    { id: 1, type: "Waste Overflow", area: "Park Avenue", status: "Pending", priority: "High", category: "Food Waste", description: "Large pile of food waste near main gate.", date: "2024-04-20" },
    { id: 2, type: "Street Light", area: "Metro Colony", status: "Resolved", priority: "Low", category: "Plastic", description: "Street light flickering.", date: "2024-04-19" }
];

export const initialTasks = [
    { id: 1, title: "Clear Bin 42", assignedTo: "Rahul Sharma", assignedToId: 1, deadline: "Today", status: "Pending", priority: "High", workerPhoto: "https://i.pravatar.cc/150?u=rahul" },
    { id: 2, title: "Area Sweep - Zone A", assignedTo: "Anita Devi", assignedToId: 2, deadline: "Tomorrow", status: "In Progress", priority: "Medium", workerPhoto: "https://i.pravatar.cc/150?u=anita" }
];

export const defaultSectionByPanel = {
    admin: "overview",
    mc: "workforce",
    citizen: "report"
};

export const panelConfig = {
    admin: {
        title: "Administrator",
        subtitle: "Full system oversight and analytics",
        metrics: [
            { label: "Registered MCs", value: "24" },
            { label: "Active Citizens", value: "1,540" },
            { label: "High Priority Alerts", value: "8" }
        ],
        sections: [
            { id: "overview", label: "Overview", icon: "fa-chart-pie" },
            { id: "mcs", label: "Manage MCs", icon: "fa-building" },
            { id: "areas", label: "Manage Areas", icon: "fa-map-marked-alt" },
            { id: "citizens", label: "Manage Citizens", icon: "fa-users" },
            { id: "complaints", label: "Manage Complaints", icon: "fa-file-invoice" },
            { id: "workers", label: "Manage Workers", icon: "fa-hard-hat" }
        ]
    },
    mc: {
        title: "Municipal Control",
        subtitle: "Operations and workforce management",
        metrics: [
            { label: "Workers On Duty", value: "85" },
            { label: "Tasks Due Today", value: "12" },
            { label: "Open Complaints", value: "34" }
        ],
        sections: [
            { id: "workforce", label: "Manage Workers", icon: "fa-hard-hat" },
            { id: "tasks", label: "Task Management", icon: "fa-tasks" },
            { id: "pipeline", label: "Manage Complaints", icon: "fa-stream" }
        ]
    },
    citizen: {
        title: "Citizen Portal",
        subtitle: "Report issues and track improvements",
        metrics: [
            { label: "Complaints Submitted", value: "5" },
            { label: "Resolved Reports", value: "3" },
            { label: "Impact Points", value: "120" }
        ],
        sections: [
            { id: "report", label: "New Report", icon: "fa-plus-circle" },
            { id: "history", label: "My History", icon: "fa-history" },
            { id: "profile", label: "My Profile", icon: "fa-user-circle" }
        ]
    }
};
