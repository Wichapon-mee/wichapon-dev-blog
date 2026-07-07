import axios from 'axios';

// URL หลักของ API บทเรียน
const API_BASE_URL = 'https://blog-post-project-api.vercel.app';

/**
 * เรียก API เพื่อดึงรายการบทความ
 * ใช้ Axios ส่ง query parameters ไปที่ GET /posts
 *
 * @param {number} page - หน้าที่ต้องการ (ค่าเริ่มต้น 1)
 * @param {number} limit - จำนวนบทความต่อหน้า (ค่าเริ่มต้น 6)
 * @param {string} [category] - กรองตามหมวด (ไม่ส่ง = ทุกหมวด)
 * @param {string} [keyword] - ค้นหาจาก title, description, content
 * @returns {Promise<object>} ข้อมูลจาก API เช่น { posts, currentPage, nextPage, totalPages }
 */
export async function fetchPosts({ page = 1, limit = 6, category, keyword } = {}) {
  const params = {
    page,
    limit,
  };

  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  // axios แปลง params เป็น query string อัตโนมัติ
  // เช่น /posts?page=2&limit=6&category=Cat
  const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
  return data;
}
