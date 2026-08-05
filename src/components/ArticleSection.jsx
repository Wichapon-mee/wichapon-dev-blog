import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
const categories = ['Highlight', 'Dog', 'Inspiration', 'General'];
// จำนวนบทความที่ดึงจาก API ต่อ 1 ครั้ง (ใช้กับ query parameter limit)
const POSTS_PER_PAGE = 6;
// จำนวนผลลัพธ์สูงสุดใน dropdown ค้นหา
const SEARCH_RESULTS_LIMIT = 10;

/**
 * สร้าง object params สำหรับส่งไป API
 * @param {string} category - หมวดที่เลือก (Highlight = ไม่กรองหมวด)
 * @param {number} page - หน้าที่ต้องการดึงข้อมูล
 * @returns {object} params เช่น { page: 1, limit: 6, category: "Dog" }
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

/** ปุ่ม View more — โหลดบทความหน้าถัดไป */
function ViewMoreButton({ hasMore, error, loading, loadingMore, onViewMore }) {
  if (!hasMore || error || loading) return null;

  return (
    <button
      type="button"
      className="article-view-more"
      onClick={onViewMore}
      disabled={loadingMore}
    >
      {loadingMore ? 'Loading...' : 'View more'}
    </button>
  );
}

function ArticleSection() {
  // --- รายการบทความ + หมวดหมู่ ---
  const [selectedCategory, setSelectedCategory] = useState('Highlight');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- View More (Pagination) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // --- Search ---
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);

  /**
   * ดึงบทความจาก API ตามหมวดและหน้าที่กำหนด
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

      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setCurrentPage(data.currentPage);
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

  /** กด View more → โหลดหน้าถัดไป แล้วต่อท้ายบทความเดิม ครั้งละ 6 รายการ */
  const handleViewMore = () => {
    const nextPage = currentPage + 1;
    loadPostsByCategory(selectedCategory, nextPage, true);
  };

  /** เปลี่ยนหมวด → โหลดบทความหน้า 1 ของหมวดนั้นใหม่ */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setError(null);
    loadPostsByCategory(category, 1, false);
  };

  /** พิมพ์ในช่องค้นหา → useEffect จะเรียก API */
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  /** เลือกบทความจากผลค้นหา → ปิด dropdown */
  const handleSearchResultClick = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  useEffect(() => {
    loadPostsByCategory('Highlight', 1, false);
  }, []);

  useEffect(() => {
    const trimmedKeyword = searchKeyword.trim();

    if (!trimmedKeyword) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);

      try {
        const data = await fetchPosts({
          keyword: trimmedKeyword,
          page: 1,
          limit: SEARCH_RESULTS_LIMIT,
        });

        setSearchResults(data.posts);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
        setShowSearchDropdown(true);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="article-section">
      <h2 className="article-title">Latest articles</h2>

      <div className="article-toolbar">
        <div className="article-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchKeyword.trim() && searchResults.length > 0) {
                setShowSearchDropdown(true);
              }
            }}
            aria-label="Search articles"
            aria-expanded={showSearchDropdown}
            aria-controls="article-search-results"
            autoComplete="off"
          />
          <Search size={16} className="article-search-icon" aria-hidden="true" />

          {showSearchDropdown && searchKeyword.trim() && (
            <ul id="article-search-results" className="article-search-dropdown" role="listbox">
              {searchLoading && (
                <li className="article-search-item article-search-item-status">Searching...</li>
              )}

              {!searchLoading && searchResults.length === 0 && (
                <li className="article-search-item article-search-item-status">No articles found</li>
              )}

              {!searchLoading &&
                searchResults.map((post) => (
                  <li key={post.id} role="option">
                    <Link
                      to={`/post/${post.id}`}
                      className="article-search-item"
                      onClick={handleSearchResultClick}
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>

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

      <div className="article-content">
        {loading && !error && (
          <div className="article-loading-overlay" role="status" aria-live="polite">
            <div className="article-loading-spinner" aria-hidden="true" />
            <p>Loading...</p>
          </div>
        )}

        <div className={`article-grid${loading && posts.length > 0 ? ' article-grid--loading' : ''}`}>
          {!error &&
            posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={formatDate(post.date)}
              />
            ))}
        </div>

        <ViewMoreButton
          hasMore={hasMore}
          error={error}
          loading={loading}
          loadingMore={loadingMore}
          onViewMore={handleViewMore}
        />
      </div>
    </section>
  );
}

export default ArticleSection;
