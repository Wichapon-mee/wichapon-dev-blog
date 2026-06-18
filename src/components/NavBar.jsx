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
        hh.
      </div>

      {/* ฝั่งขวา: กลุ่มปุ่มกด และ แฮมเบอร์เกอร์เมนู */}
      <div>
        {/* กลุ่มปุ่มปกติ (จะถูกซ่อนเมื่อเปิดบนมือถือ) */}
        <div className="nav-buttons" style={{ display: 'flex', gap: '15px' }}>
          <button style={{ padding: '10px 24px', borderRadius: '20px', border: '1px solid #333', background: 'transparent', cursor: 'pointer', fontWeight: '500' }}>Log in</button>
          <button style={{ padding: '10px 24px', borderRadius: '20px', border: 'none', background: '#1a1a1a', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Sign up</button>
        </div>

        {/* ปุ่มแฮมเบอร์เกอร์ ☰ (จะแสดงผลเฉพาะบนมือถือ) */}
        <div className="nav-hamburger" style={{ fontSize: '24px', cursor: 'pointer', display: 'none', color: '#333' }}>
          ☰
        </div>
      </div>

      {/* สไตล์พิเศษสำหรับเปลี่ยนปุ่มตามขนาดหน้าจอ */}
      <style>{`
        @media (max-width: 768px) {
          .nav-buttons { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

export default NavBar;
