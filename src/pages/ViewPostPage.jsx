import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Copy, Smile } from 'lucide-react';
import { NavBar, Footer } from '@/components/NavBar';
import LoginRequiredDialog from '@/components/LoginRequiredDialog';
import CopyToast from '@/components/CopyToast';
import { fetchPostById } from '@/api/blogApi';

// Assignment: สมมติว่าผู้ใช้ทุกคนยังไม่ได้เข้าสู่ระบบ
const isLoggedIn = false;

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function ViewPostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPostById(postId);
        setPost(data);
      } catch {
        setError('Failed to load this article. Please try again later.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return true;
    }
    return false;
  };

  const handleLikeClick = () => {
    if (requireLogin()) return;
  };

  const handleCommentFocus = (event) => {
    if (requireLogin()) {
      event.target.blur();
    }
  };

  const handleSendComment = () => {
    if (requireLogin()) return;
  };

  const handleCopyLink = async () => {
    const pageUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(pageUrl);
      setShowCopiedToast(true);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = pageUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setShowCopiedToast(true);
      } catch {
        // clipboard ไม่พร้อมใช้งาน
      }
    }
  };

  const pageUrl = window.location.href;
  const encodedShareUrl = encodeURIComponent(pageUrl);

  const facebookShareUrl = `https://www.facebook.com/share.php?u=${encodedShareUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`;
  const twitterShareUrl = `https://www.twitter.com/share?&url=${encodedShareUrl}`;

  return (
    <div className="view-post-layout">
      <NavBar />

      {loading && (
        <div className="article-loading" role="status" aria-live="polite">
          <div className="article-loading-spinner" aria-hidden="true" />
          <p>Loading...</p>
        </div>
      )}

      {error && <p className="view-post-error">{error}</p>}

      {!loading && !error && post && (
        <>
          <img
            className="view-post-hero"
            src={post.image}
            alt={post.title}
          />

          <div className="view-post-container">
            <article className="view-post-main">
              <span className="view-post-category">{post.category}</span>
              <p className="view-post-date">{formatDate(post.date)}</p>
              <h1 className="view-post-title">{post.title}</h1>
              <p className="view-post-description">{post.description}</p>

              <div className="view-post-content">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              <div className="view-post-actions">
                <button
                  type="button"
                  className="view-post-like-btn"
                  onClick={handleLikeClick}
                  aria-label={`Like post, ${post.likes} likes`}
                >
                  <Smile size={18} aria-hidden="true" />
                  <span>{post.likes}</span>
                </button>

                <div className="view-post-share-group">
                  <button
                    type="button"
                    className="view-post-copy-btn"
                    onClick={handleCopyLink}
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy
                  </button>

                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="view-post-social-btn"
                    aria-label="Share on Facebook"
                  >
                    <FacebookIcon />
                  </a>

                  <a
                    href={linkedinShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="view-post-social-btn"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon />
                  </a>

                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="view-post-social-btn"
                    aria-label="Share on Twitter"
                  >
                    <TwitterIcon />
                  </a>
                </div>
              </div>

              <div className="view-post-comment">
                <h2 className="view-post-comment-title">Comment</h2>
                <div className="view-post-comment-box">
                  <textarea
                    className="view-post-comment-input"
                    placeholder="What are your thoughts?"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    onFocus={handleCommentFocus}
                    onClick={handleCommentFocus}
                    readOnly={!isLoggedIn}
                  />
                  <button
                    type="button"
                    className="view-post-send-btn"
                    onClick={handleSendComment}
                  >
                    Send
                  </button>
                </div>
              </div>
            </article>

            <aside className="view-post-sidebar">
              <div className="view-post-author-card">
                <img
                  className="view-post-author-avatar"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                  alt={post.author}
                />
                <p className="view-post-author-label">Author</p>
                <p className="view-post-author-name">{post.author}</p>
                <p className="view-post-author-bio">
                  I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                </p>
              </div>
            </aside>
          </div>
        </>
      )}

      <Footer />

      <LoginRequiredDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />

      <CopyToast
        open={showCopiedToast}
        onClose={() => setShowCopiedToast(false)}
      />
    </div>
  );
}

export default ViewPostPage;
