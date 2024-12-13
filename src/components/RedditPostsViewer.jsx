import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { 
  Eye, 
  ArrowUpCircle, 
  Clock, 
  RefreshCw, 
  GitBranchIcon
} from 'lucide-react';
import Loader from './ui/Loader';

const RedditPostsViewer = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('recent');

  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        const response = await fetch('https://www.reddit.com/r/reactjs.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data.data.children);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchRedditPosts();
  }, []);

  const renderSafeHTML = (html) => {
    if (!html) return null;
    try {
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      });

      return (
        <div className="text-gray-300 text-sm leading-relaxed">
          {parse(sanitizedHtml)}
        </div>
      );
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return null;
    }
  };

  const truncateText = (text, maxLength = 200) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  const filterPosts = (posts) => {
    switch(activeFilter) {
      case 'top':
        return [...posts].sort((a, b) => b.data.score - a.data.score);
      case 'recent':
      default:
        return posts;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-xl text-center">
          <p className="text-red-400 font-semibold">
            Unable to fetch posts: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto">
        {/* Header with Filters */}
        <div className="mb-12 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            React Community Insights
          </h1>
          <div className="flex space-x-2">
            {['recent', 'top'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter === 'recent' ? 'Recent' : 'Top Posts'}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 gap-6">
          {filterPosts(posts).map((post) => (
            <div 
              key={post.data.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-900/50"
            >
              {/* Post Header */}
              <div className="bg-gray-900/60 p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-blue-300 line-clamp-2">
                  {post.data.title}
                </h2>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <div className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {/* {renderSafeHTML(truncateText(post.data.selftext_html || ''))} */}
                  {post.data.selftext.length > 200
                    ? renderSafeHTML(truncateText(post.data.selftext))
                    : renderSafeHTML(post.data.selftext)}
                </div>

                {/* Post Stats */}
                <div className="flex justify-between items-center text-sm text-gray-500 space-x-2">
                  <div className="flex items-center space-x-1">
                    <ArrowUpCircle size={16} className="text-blue-500" />
                    <span>{post.data.score}</span>
                  </div>
                  <a 
                    href={post.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-blue-900/30 hover:bg-blue-900/50 px-3 py-1 rounded-full transition-all"
                  >
                    <Eye size={16} className="text-blue-400" />
                    <span>View Post</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 mt-12">
          <p>made by <a href="https://github.com/adharsh-a" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline"><GitBranchIcon size={16} className="inline-block" /> adharshboddul</a></p>
        </div>
      </div>
    </div>
  );
};

export default RedditPostsViewer;