import { FaFacebookF, FaTwitter, FaEnvelope, FaUser } from "react-icons/fa";
import agent1 from "../assets/img/team/team-1.jpg";
import agent2 from "../assets/img/team/team-2.jpg";
import agent3 from "../assets/img/team/team-3.jpg";
import "../assets/css/consultants.css";

export default function Consultants() {
  return (
    <section className="consultant-section">
      <div className="container">
        {/* Header */}
        <div className="consultant-header">
          <h2>OUR PROPERTY CONSULTANTS</h2>

          <button className="consultant-btn">
            <FaUser /> VIEW ALL CONSULTANTS
          </button>
        </div>

        {/* Cards */}
        <div className="consultant-cards">
          {/* Card 1 */}
          <div className="consultant-card">
            <div className="consultant-basic">
              <img src={agent1} alt="agent" />
              <h3>Rahul Sharma</h3>
              <span className="phone">+91 98765 43210</span>
            </div>

            <div className="consultant-hover">
              <img src={agent1} alt="agent" />
              <h3>Rahul Sharma</h3>
              <span className="phone">+91 98765 43210</span>

              <p>
                Residential property expert specializing in apartments and
                villas across prime city locations.
              </p>

              <div className="consultant-social">
                <FaFacebookF />
                <FaTwitter />
                <FaEnvelope />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="consultant-card">
            <div className="consultant-basic">
              <img src={agent2} alt="agent" />
              <h3>Pooja Verma</h3>
              <span className="phone">+91 91234 56789</span>
            </div>

            <div className="consultant-hover">
              <img src={agent2} alt="agent" />
              <h3>Pooja Verma</h3>
              <span className="phone">+91 91234 56789</span>

              <p>
                Expert in luxury apartments and premium residential projects
                across metropolitan areas.
              </p>

              <div className="consultant-social">
                <FaFacebookF />
                <FaTwitter />
                <FaEnvelope />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="consultant-card">
            <div className="consultant-basic">
              <img src={agent3} alt="agent" />
              <h3>Amit Patel</h3>
              <span className="phone">+91 99887 66554</span>
            </div>

            <div className="consultant-hover">
              <img src={agent3} alt="agent" />
              <h3>Amit Patel</h3>
              <span className="phone">+91 99887 66554</span>

              <p>
                Specialist in commercial properties including office spaces and
                retail developments.
              </p>

              <div className="consultant-social">
                <FaFacebookF />
                <FaTwitter />
                <FaEnvelope />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
