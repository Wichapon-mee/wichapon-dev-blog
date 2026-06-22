import React from 'react';

const LinkedinIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// แก้ไข Todo 1: เปลี่ยนจาก default export เป็น Named Export โดยการเติมคำว่า export const ด้านหน้า
export const NavBar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: '#f8f9fa',
      borderBottom: '1px solid #eaeaea'
    }}>
      {/* ฝั่งซ้าย: โลโก้ */}
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        DogGo.
      </div>

      {/* ฝั่งขวา: กลุ่มปุ่มกด และ แฮมเบอร์เกอร์เมนู */}
      <div>
        {/* กลุ่มปุ่มปกติ */}
        <div className="nav-buttons" style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-login" style={{ padding: '10px 24px', borderRadius: '20px', border: '1px solid #333', background: 'transparent', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}>Log in</button>
          <button className="btn-signup" style={{ padding: '10px 24px', borderRadius: '20px', border: 'none', background: '#1a1a1a', color: '#fff', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}>Sign up</button>
        </div>

        {/* ปุ่มแฮมเบอร์เกอร์ ☰ */}
        <div className="nav-hamburger" style={{ fontSize: '24px', cursor: 'pointer', display: 'none', color: '#333' }}>
          ☰
        </div>
      </div>

      <style>{`
        .btn-login:hover {
          background-color: #cccccc !important;
        }
        .btn-signup:hover {
          background-color: #cccccc !important;
        }
        @media (max-width: 768px) {
          .nav-buttons { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// แก้ไข Todo 2: เพิ่ม Component Footer ไว้ในไฟล์เดียวกัน และส่งออกด้วย Named Export
// 1. ตรวจสอบบรรทัดบนสุดของไฟล์ NavBar.jsx ให้มีตัวดึงไอคอนเหล่านี้นะครับ:
// import { Linkedin, Github, Globe } from "lucide-react";

// 2. โค้ดส่วน Footer ใหม่แกะกล่องตามรูปแบบภาพดีไซน์
export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f1f1f0', // สีพื้นหลังเทาอ่อนนวลๆ ตามรูปภาพ
      padding: '30px 40px',
      fontFamily: 'sans-serif',
      borderTop: '1px solid #eaeaea'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        
        {/* ฝั่งซ้าย: Get in touch และกลุ่มไอคอนโซเชียลสีดำวงกลม */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
            Get in touch
          </span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* ไอคอนที่ 1: Linkedin */}
            <a href="#linkedin" style={{ color: '#fff', backgroundColor: '#333', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <LinkedinIcon size={12} />
            </a>
            
            {/* ไอคอนที่ 2: Github */}
            <a href="#github" style={{ color: '#fff', backgroundColor: '#333', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <GithubIcon size={12} />
            </a>
            
            {/* ไอคอนที่ 3: Google (ใช้ตัวอักษร G หนาในวงกลมเพื่อให้ตรงตามดีไซน์เป๊ะๆ) */}
            <a href="#google" style={{ color: '#fff', backgroundColor: '#333', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
              G
            </a>
          </div>
        </div>

        {/* ฝั่งขวา: ลิงก์ Home page ขีดเส้นใต้ */}
        <div>
          <a href="/" style={{ 
            fontSize: '14px', 
            color: '#1a1a1a', 
            textDecoration: 'underline', 
            fontWeight: '500' 
          }}>
            Home page
          </a>
        </div>

      </div>
    </footer>
  );
}

