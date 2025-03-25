// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      

      {/* Main Content */}
      <div className="hero-section">
        <h1>Welcome to Task Manager Pro</h1>
        <p className="subtitle">
          Your ultimate solution for organizing tasks and boosting productivity.
          <br />
          Sign up or login to start managing your tasks efficiently.
        </p>
        
        <div className="cta-buttons">
          <Link to="/register" className="cta-button">Get Started</Link>
          <Link to="/login" className="cta-button secondary">Existing User? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;