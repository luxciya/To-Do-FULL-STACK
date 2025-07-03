import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>© {new Date().getFullYear()} Todo Task App | Built for Katomaran Hackathon</p>
    </footer>
  );
};

const footerStyle = {
  textAlign: 'center',
  padding: '1rem',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.2)',
  color: '#fff',
  fontSize: '14px',
};

export default Footer;
