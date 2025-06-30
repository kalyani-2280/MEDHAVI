import React, { useState } from 'react';
import { FaPaperPlane, FaFileUpload, FaCommentDots, FaUsers } from 'react-icons/fa';

const CommunityPage = () => {
  const [postContent, setPostContent] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const handlePost = () => {
    if (!postContent && !file) return;
    const newPost = {
      id: Date.now(),
      content: postContent,
      file: file ? file.name : null,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setPostContent('');
    setFile(null);
  };

  const handleComment = (postId, comment) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-6 flex items-center justify-center gap-3">
          <FaUsers className="text-orange-500" /> Medhavi Community
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Ask a question, share an idea, or post a resource..."
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <FaFileUpload />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file?.name && <span className="text-gray-700">{file.name}</span>}
            </label>
            <button
              onClick={handlePost}
              className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPaperPlane /> Post
            </button>
          </div>
        </div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                <p className="mb-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>
                {post.file && (
                  <div className="text-sm text-blue-600 underline">📎 {post.file}</div>
                )}
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-indigo-700 mb-1">Comments</h4>
                  {post.comments.map((c, i) => (
                    <div key={i} className="text-sm text-gray-700 ml-2 mb-1">💬 {c}</div>
                  ))}
                  <CommentInput onAdd={(text) => handleComment(post.id, text)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentInput = ({ onAdd }) => {
  const [comment, setComment] = useState('');
  const handleAdd = () => {
    if (!comment.trim()) return;
    onAdd(comment.trim());
    setComment('');
  };

  return (
    <div className="flex mt-2 gap-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border rounded px-2 py-1 text-sm"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
      >
        <FaCommentDots />
      </button>
    </div>
  );
};

export default CommunityPage;
