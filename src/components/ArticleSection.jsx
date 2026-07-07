import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchPosts } from '@/api/blogApi';
import BlogCard from './ฺBlogCard';

// รายการหมวดหมู่ที่แสดงใน UI (ปุ่ม Desktop และ Dropdown Mobile)
const categories = ['Highlight', 'Cat', 'Inspiration', 'General'];
// จำนวนบทความที่ดึงจาก API ต่อ 1 ครั้ง (ใช้กับ query parameter limit)
const POSTS_PER_PAGE = 6;

/**
 * สร้าง object params สำหรับส่งไป API
 * @param {string} category - หมวดที่เลือก (Highlight = ไม่กรองหมวด)
 * @param {number} page - หน้าที่ต้องการดึงข้อมูล
 * @returns {object} params เช่น { page: 1, limit: 6, category: "Cat" }
 */
function getRequestParams(category, page) {
  const params = {
    page,
    limit: POSTS_PER_PAGE,
  };

  // Highlight แสดงทุกหมวด → ไม่ส่ง category ไป API
  if (category !== 'Highlight') {
    params.category = category;
  }

  return params;
}

/**
 * แปลงวันที่จาก API (รูปแบบ ISO) เป็นข้อความที่อ่านง่าย
 * ตัวอย่าง: "2024-09-11T00:00:00.000Z" → "11 September 2024"
 */
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArticleSection() {
  // --- useState: เก็บข้อมูลที่เปลี่ยนได้ และทำให้ UI อัปเดตเมื่อค่าเปลี่ยน ---
  const [selectedCategory, setSelectedCategory] = useState('Highlight'); // หมวดที่ผู้ใช้เลือกอยู่
  const [posts, setPosts] = useState([]); // รายการบทความที่แสดงบนหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันจาก API
  const [hasMore, setHasMore] = useState(false); // ยังมีหน้าถัดไปให้โหลดหรือไม่
  const [loading, setLoading] = useState(true); // กำลังโหลด — แสดง spinner กลางจอ
  const [loadingMore, setLoadingMore] = useState(false); // กำลังโหลดเพิ่มจากปุ่ม View more
  const [error, setError] = useState(null); // ข้อความ error เมื่อเรียก API ไม่สำเร็จ

  /**
   * ดึงบทความจาก API ตามหมวดและหน้าที่กำหนด
   * @param {string} category - หมวดที่ต้องการ
   * @param {number} page - หน้าที่ต้องการ (เริ่มที่ 1)
   * @param {boolean} append - true = ต่อท้ายบทความเดิม (View more), false = แทนที่ทั้งหมด
   */
  const loadPostsByCategory = async (category, page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const params = getRequestParams(category, page);
      const data = await fetchPosts(params);

      // append = true → เอาบทความใหม่ต่อท้ายของเดิม (ใช้ตอนกด View more)
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setCurrentPage(data.currentPage);
      // API ส่ง nextPage มาเมื่อยังมีหน้าถัดไป → ใช้ควบคุมการแสดงปุ่ม View more
      setHasMore(Boolean(data.nextPage));
    } catch {
      if (!append) {
        setError('Failed to load articles. Please try again later.');
        setPosts([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /**
   * ทำงานเมื่อผู้ใช้เปลี่ยนหมวด (จาก Select บน Mobile หรือปุ่มบน Desktop)
   * อัปเดต state หมวด แล้วโหลดบทความหน้า 1 ของหมวดนั้นใหม่
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadPostsByCategory(category, 1, false);
  };

  /**
   * ทำงานเมื่อกดปุ่ม View more
   * โหลดหน้าถัดไป (page + 1) แล้วต่อท้ายบทความเดิม ครั้งละ 6 รายการ
   */
  const handleViewMore = () => {
    const nextPage = currentPage + 1;
    loadPostsByCategory(selectedCategory, nextPage, true);
  };

  // useEffect: รันครั้งเดียวตอนเปิดหน้าเว็บ → โหลดบทความ Highlight หน้าแรก
  useEffect(() => {
    loadPostsByCategory('Highlight', 1, false);
  }, []);

  return (
    <section className="article-section">
      <h2 className="article-title">Latest articles</h2>

      <div className="article-toolbar">
        {/* ช่องค้นหา (ยังไม่เปิดใช้งาน) */}
        <div className="article-search">
          <input
            type="text"
            placeholder="Search"
            disabled
            aria-label="Search articles"
          />
          <Search size={16} className="article-search-icon" aria-hidden="true" />
        </div>

        {/* Dropdown เลือกหมวด — แสดงบน Mobile */}
        <div className="article-category-mobile">
          <label htmlFor="category-select" className="article-category-label">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger
              id="category-select"
              className="article-select-trigger w-full bg-white text-[#666] shadow-none focus-visible:border-[#ddd] focus-visible:ring-0"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="border-[#ddd] shadow-sm">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-[#333] [&_span.absolute]:hidden"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ปุ่มเลือกหมวด — แสดงบน Desktop */}
        <div className="article-category-desktop">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                category === selectedCategory
                  ? 'article-category-btn active'
                  : 'article-category-btn'
              }
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="article-status article-status-error">{error}</p>}

      {loading && !error ? (
        <div className="article-loading" role="status" aria-live="polite">
          <div className="article-loading-spinner" aria-hidden="true" />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="article-grid">
          {!error &&
            posts.map((post) => (
              <BlogCard
                key={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={formatDate(post.date)}
              />
            ))}
        </div>
      )}

      {/* แสดงปุ่ม View more เมื่อ API ยังมีหน้าถัดไป (hasMore = true) */}
      {hasMore && !error && !loading && (
        <button
          type="button"
          className="article-view-more"
          onClick={handleViewMore}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'View more'}
        </button>
      )}
    </section>
  );
}

export default ArticleSection;
