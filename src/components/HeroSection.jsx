import React from 'react';
import GoldenRetrive from '../assets/GoldenRetrive.png';

export const  HeroSection = () =>  {
  return (
    <div className="hero-container">
      
      {/* คอลัมน์ที่ 1 (ซ้าย): ข้อความโปรย */}
      <div className="hero-text-left" style={{ textAlign: 'right', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1.2', margin: '0 0 20px 0', color: '#1a1a1a' }}>
         Pure Love<br />Has Four Paws,<br />Stay Loyal
        </h1>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
         Welcome to a webpage dedicated entirely to news, updates, and pure cuteness!
        </p>
      </div>

      {/* คอลัมน์ที่ 2 (กลาง): รูปภาพ */}
      <div className="hero-image-center" style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src={GoldenRetrive} 
          alt="GoldenDog" 
          style={{
            width: '100%',
            maxWidth: '320px',
            borderRadius: '35px',
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
        I am a Full-Stack Development student at TechUp with a deep passion and love for dogs. Building this website brings me so much joy, as my goal is to share both helpful information and the pure cuteness of dogs with everyone who visits this page.
        </p>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
        In my free time or whenever pets come up in conversation, I always talk about dogs and spend time researching these adorable creatures.
        </p>
      </div>

    </div>
  );
}


