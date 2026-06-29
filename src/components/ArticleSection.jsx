import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { blogPosts } from '@/data/blogPosts';
import BlogCard from './ฺBlogCard';

const categories = ["Highlight", "Dog", "Inspiration", "General"];

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState('Highlight');

  const filteredPosts =
    selectedCategory === 'Highlight'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <section className="article-section">
      <h2 className="article-title">Latest articles</h2>

      <div className="article-toolbar">
        <div className="article-search">
          <input
            type="text"
            placeholder="Search"
            disabled
            aria-label="Search articles"
          />
          <Search size={16} className="article-search-icon" aria-hidden="true" />
        </div>

        <div className="article-category-mobile">
          <label htmlFor="category-select" className="article-category-label">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="article-grid">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>

      <button type="button" className="article-view-more">
        View more
      </button>
    </section>
  );
}

export default ArticleSection;
