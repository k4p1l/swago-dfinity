import "./css/Footer.css";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="empty-div"></div>
      <footer className="footer">
        <div>
          <div className="row1">
            <div className="logo-wrapper">
              <img src={logo} alt="logo" />
            </div>

            <div className="footer-content">
              <div>
                <h2>Quick Links</h2>

                <Link>
                  Home<ion-icon name="arrow-forward-sharp"></ion-icon>
                </Link>

                <Link>
                  About Us<ion-icon name="arrow-forward-sharp"></ion-icon>
                </Link>

                <Link>
                  NFT Marketplace
                  <ion-icon name="arrow-forward-sharp"></ion-icon>
                </Link>

                <Link>
                  3D Spaces<ion-icon name="arrow-forward-sharp"></ion-icon>
                </Link>

                <Link>
                  3D Avatar<ion-icon name="arrow-forward-sharp"></ion-icon>
                </Link>
              </div>
              <div>
                <h2>Follow Us</h2>
                <a
                  href="https://www.linkedin.com/company/zori-live/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn<ion-icon name="arrow-forward-sharp"></ion-icon>
                </a>
                <a
                  href="https://www.instagram.com/the.zori_/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram<ion-icon name="arrow-forward-sharp"></ion-icon>
                </a>
                <a
                  href="https://x.com/Zori_Live"
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter<ion-icon name="arrow-forward-sharp"></ion-icon>
                </a>
                <a
                  href="https://t.me/ZoriLive"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram<ion-icon name="arrow-forward-sharp"></ion-icon>
                </a>
              </div>
            </div>
          </div>
          <div className="row2">
            <p>
              Web3 offers the potential for direct interaction and transactions
              worldwide while allowing individuals to maintain total control
              over their personal data.
            </p>
            <p>&copy; 2024 The Zori. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
