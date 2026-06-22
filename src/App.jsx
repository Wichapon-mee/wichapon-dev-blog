import React from 'react';
// แก้ไขสถานการณ์ที่ 2: เปลี่ยนเป็น Named Import ดึง { NavBar, Footer } มาจากไฟล์เดียวกันด้วยปีกกา
import { NavBar, Footer } from './components/NavBar';

// แก้ไขสถานการณ์ที่ 2: หากโค้ดในไฟล์ HeroSection.jsx เปลี่ยนเป็น Named Export แล้ว ให้ใส่ปีกกาครอบแบบนี้ครับ
// (แต่ถ้าไฟล์ HeroSection ยังเป็นแบบเก่าอยู่ ให้ลบปีกกา {} ออกได้ครับพี่)
import { HeroSection } from './components/HeroSection';

// สถานการณ์ที่ 3: นำเข้าคอมโพเนนต์ค้นหาบทความแบบ Default Import (ไม่มีปีกกาครอบ)
import ArticleSection from './components/ArticleSection';
import './App.css';

function App() {
  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* แสดงผลแถบเมนูด้านบน */}
        <NavBar />
        
        {/* แสดงผลเนื้อหาต้อนรับหลัก */}
        <HeroSection />
        
        {/* แสดงผลแถบค้นหาบทความที่เราจะสร้างในสเต็ปถัดไป */}
        <ArticleSection />
      </div>

      {/* แสดงผลแถบข้อมูลติดต่อด้านล่างสุด พร้อมไอคอนจาก lucide-react */}
      <Footer />
    </div>
  );
}

export default App;
