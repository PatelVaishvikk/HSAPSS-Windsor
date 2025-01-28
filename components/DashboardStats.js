// components/DashboardStats.js
export default function DashboardStats({ stats }) {
    return (
        <div className="row g-4 mb-4">
            {stats.map((stat, index) => (
                <div key={index} className="col-12 col-sm-6 col-xl-3">
                    <div className={`stat-card ${stat.bgClass} text-white`}>
                        <div className="stat-card-body">
                            <i className={`fas ${stat.icon} stat-icon`}></i>
                            <div className="stat-content">
                                <h3 className="stat-count">{stat.count}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
