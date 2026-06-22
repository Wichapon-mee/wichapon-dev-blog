import React from 'react';
// ดึงไอคอนแว่นขยายมาใช้งานในช่องค้นหาตามโจทย์สั่ง
import { Search } from 'lucide-react';

function ArticleSection() {
  return (
    <section style={{
      wFull: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 40px 20px 40px',
      fontFamily: 'sans-serif'
    }}>
      {/* หัวข้อหลัก */}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '16px' }}>
        Latest articles
      </h2>

      {/* แถบเมนูสีเทาอ่อนชิ้นใหญ่ขอบมน */}
      <div style={{
        backgroundColor: '#f3f3f3',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        
        {/* ฝั่งซ้าย: รายการหมวดหมู่ (Categories) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* ปุ่ม Highlight ที่มีสถานะ Active สีเข้มตามภาพ */}
          <button style={{ backgroundColor: '#dcdaba', color: '#1a1a1a', fontWeight: '500', padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Highlight
          </button>
          
          <button style={{ color: '#666', fontWeight: '500', padding: '6px 16px', border: 'none', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}>
            Cat
          </button>
          
          <button style={{ color: '#666', fontWeight: '500', padding: '6px 16px', border: 'none', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}>
            Inspiration
          </button>
          
          <button style={{ color: '#666', fontWeight: '500', padding: '6px 16px', border: 'none', background: 'transparent', fontSize: '14px', cursor: 'pointer' }}>
            Ganeral
          </button>
        </div>

        {/* ฝั่งขวา: ช่องค้นหา (Search Input) ขอบมนขนาดพอดีพร้อมแว่นขยาย */}
        <div style={{
          position: 'relative',
          width: '260px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #eaeaea',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              width: '100%',
              padding: '10px 40px 10px 16px',
              fontSize: '14px',
              color: '#333',
              border: 'none',
              outline: 'none'
            }}
            disabled // ปิด Logic การกรอกชั่วคราวตามเงื่อนไขโจทย์
          />
          {/* จัดตำแหน่งไอคอนแว่นขยายฝั่งขวา */}
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            color: '#999'
          }}>
            <Search size={16} />
          </div>
        </div>

      </div>
    </section>
  );
}

// นำเข้ากลับมา Render ใน React Component App แบบ Default Export Import ตามที่โจทย์กำหนด
export default ArticleSection;
