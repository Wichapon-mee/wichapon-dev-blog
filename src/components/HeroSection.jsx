import React from 'react';
import heroImg from '../assets/hero.png';

function HeroSection() {
  return (
    <div className="hero-container">
      
      {/* คอลัมน์ที่ 1 (ซ้าย): ข้อความโปรย */}
      <div className="hero-text-left" style={{ textAlign: 'right', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1.2', margin: '0 0 20px 0', color: '#1a1a1a' }}>
          Stay<br />Informed,<br />Stay Inspired
        </h1>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
        </p>
      </div>

      {/* คอลัมน์ที่ 2 (กลาง): รูปภาพ */}
      <div className="hero-image-center" style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src={heroImg} 
          alt="Hero" 
          style={{
            width: '100%',
            maxWidth: '320px',
            borderRadius: '16px',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* คอลัมน์ที่ 3 (ขวา): ข้อมูลผู้เขียน */}
      <div className="hero-text-right" style={{ textAlign: 'left', paddingLeft: '20px' }}>
        <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
          - Author
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#1a1a1a' }}>
          Wichapon Meeyen.
        </h2>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
        </p>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
        </p>
      </div>

    </div>
  );
}

export default HeroSection;
