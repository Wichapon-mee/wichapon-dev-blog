import React from 'react';

function NavBar() {
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
          {/* 1. เติม className="btn-login" */}
          <button className="btn-login" style={{ padding: '10px 24px', borderRadius: '20px', border: '1px solid #333', background: 'transparent', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}>Log in</button>
          
          {/* 2. เติม className="btn-signup" */}
          <button className="btn-signup" style={{ padding: '10px 24px', borderRadius: '20px', border: 'none', background: '#1a1a1a', color: '#fff', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' }}>Sign up</button>
        </div>

        {/* ปุ่มแฮมเบอร์เกอร์ ☰ */}
        <div className="nav-hamburger" style={{ fontSize: '24px', cursor: 'pointer', display: 'none', color: '#333' }}>
          ☰
        </div>
      </div>

      {/* สไตล์พิเศษ (เพิ่ม Hover เข้าไปตรงนี้) */}
      <style>{`
        /* เอฟเฟกต์ Hover ของปุ่ม Log in */
        .btn-login:hover {
          background-color: #cccccc !important; /* เปลี่ยนพื้นหลังเป็นสีเทาอ่อน */
        }

        /* เอฟเฟกต์ Hover ของปุ่ม Sign up */
        .btn-signup:hover {
          background-color: #cccccc !important; /* เปลี่ยนพื้นหลังให้สีดำสว่างขึ้นมาหน่อย */
        }

        @media (max-width: 768px) {
          .nav-buttons { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

export default NavBar;

