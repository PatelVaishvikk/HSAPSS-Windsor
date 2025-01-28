// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    <i className="fas fa-phone-square-alt me-2"></i>HSAPSS Windsor
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" href="/">
                                <i className="fas fa-home me-1"></i>Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/add-yuvak">
                                <i className="fas fa-user-plus me-1"></i>Add New Yuvak
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/students-table">
                                <i className="fas fa-table me-1"></i>Students Table
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/call-logs">
                                <i className="fas fa-phone me-1"></i>Call Logs
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
