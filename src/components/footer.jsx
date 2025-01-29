import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href="https://vk.com/captainyuichka" className="social-link">
            VK
          </a>
          <a href="https://t.me/CaptainYuichka" className="social-link">
            Telegram
          </a>
          <a href="https://github.com/CaptainYui4ka/" className="social-link">
            GitHub
          </a>
        </div>
        <div className="footer-info">
          <h6 className="footer-title">Система управления документами</h6>
          <p className="footer-contact">
            <span className="footer-icon">🏠</span> Россия, Уфа
          </p>
          <p className="footer-contact">
            <span className="footer-icon">✉️</span> yuichkacaptain@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;