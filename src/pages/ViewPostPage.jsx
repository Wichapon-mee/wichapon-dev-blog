import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Copy, Heart } from 'lucide-react';
import { NavBar, Footer } from '@/components/NavBar';
import LoginRequiredDialog from '@/components/LoginRequiredDialog';
import CopyToast from '@/components/CopyToast';
import {
  createPostComment,
  fetchPostById,
  fetchPostComments,
  fetchPostLikeStatus,
  togglePostLike,
} from '@/api/blogApi';
import { fetchAuthorProfile } from '@/api/authApi';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop';

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCommentDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
  const { isAuthenticated, token } = useAuth();

  const [post, setPost] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const loadComments = useCallback(async () => {
    try {
      const data = await fetchPostComments(postId);
      setComments(data);
    } catch {
      setComments([]);
    }
  }, [postId]);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const [data, author] = await Promise.all([
          fetchPostById(postId),
          fetchAuthorProfile().catch(() => null),
        ]);
        setPost(data);
        setAuthorProfile(author);
        await loadComments();

        if (token) {
          const hasLiked = await fetchPostLikeStatus(token, postId);
          setLiked(hasLiked);
        } else {
          setLiked(false);
        }
      } catch {
        setError('Failed to load this article. Please try again later.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, token, loadComments]);

  const requireLogin = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return true;
    }
    return false;
  };

  const handleLikeClick = async () => {
    if (requireLogin()) return;

    setLikeLoading(true);

    try {
      const data = await togglePostLike(token, postId);
      setLiked(data.liked);
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : prev));
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentInteraction = (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      event.target.blur();
      setShowLoginDialog(true);
    }
  };

  const handleSendComment = async () => {
    if (requireLogin()) return;

    const trimmed = comment.trim();
    if (!trimmed) {
      setCommentError('Please enter a comment before sending.');
      return;
    }

    setCommentLoading(true);
    setCommentError('');

    try {
      await createPostComment(token, postId, trimmed);
      setComment('');
      await loadComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
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
        // clipboard unavailable
      }
    }
  };

  const pageUrl = window.location.href;
  const encodedShareUrl = encodeURIComponent(pageUrl);
  const facebookShareUrl = `https://www.facebook.com/share.php?u=${encodedShareUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`;
  const twitterShareUrl = `https://www.twitter.com/share?&url=${encodedShareUrl}`;
  const authorName = authorProfile?.name || post?.author || 'Author';
  const authorAvatar = authorProfile?.profilePic || DEFAULT_AVATAR;
  const authorBio = authorProfile?.bio || '';

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
                  className={`view-post-like-btn${liked ? ' view-post-like-btn--active' : ''}`}
                  onClick={handleLikeClick}
                  disabled={likeLoading}
                  aria-label={`Like post, ${post.likes} likes`}
                  aria-pressed={liked}
                >
                  <Heart size={18} aria-hidden="true" fill={liked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>

                <div className="view-post-share-group">
                  <button
                    type="button"
                    className="view-post-copy-btn"
                    onClick={handleCopyLink}
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy link
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
                    onFocus={handleCommentInteraction}
                    onClick={handleCommentInteraction}
                    readOnly={!isAuthenticated}
                  />
                  <button
                    type="button"
                    className="view-post-send-btn"
                    onClick={handleSendComment}
                    disabled={commentLoading || !isAuthenticated}
                  >
                    {commentLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {commentError && <p className="field-error">{commentError}</p>}

                <ul className="view-post-comment-list">
                  {comments.map((item) => {
                    const displayName = item.name || item.username || 'Member';
                    const avatarSrc = item.profile_pic || DEFAULT_AVATAR;

                    return (
                      <li key={item.id} className="view-post-comment-item">
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="view-post-comment-avatar"
                        />
                        <div className="view-post-comment-body">
                          <div className="view-post-comment-meta">
                            <strong>{displayName}</strong>
                            <span>{formatCommentDate(item.created_at)}</span>
                          </div>
                          <p className="view-post-comment-text">{item.comment_text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>

            <aside className="view-post-sidebar">
              <div className="view-post-author-card">
                <img
                  className="view-post-author-avatar"
                  src={authorAvatar}
                  alt={authorName}
                />
                <p className="view-post-author-label">Author</p>
                <p className="view-post-author-name">{authorName}</p>
                {authorBio && (
                  <p className="view-post-author-bio">{authorBio}</p>
                )}
              </div>
            </aside>
          </div>
        </>
      )}

      <Footer />

      <LoginRequiredDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        returnTo={`/post/${postId}`}
      />

      <CopyToast
        open={showCopiedToast}
        onClose={() => setShowCopiedToast(false)}
      />
    </div>
  );
}

export default ViewPostPage;
