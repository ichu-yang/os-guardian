/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post } from '../types';
import { MessageSquare, Heart, Share2, Send } from 'lucide-react';

interface SocialFeedProps {
  posts: Post[];
  onAddPost: (content: string) => void;
  onLikePost: (postId: string) => void;
}

export default function SocialFeed({ posts, onAddPost, onLikePost }: SocialFeedProps) {
  const [newPostContent, setNewPostContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      onAddPost(newPostContent.trim());
      setNewPostContent('');
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} 天前`;
    if (hours > 0) return `${hours} 小時前`;
    if (minutes > 0) return `${minutes} 分鐘前`;
    return '剛剛';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col" id="social-feed">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> 社群動態分享
        </h2>
        <p className="text-xs text-slate-400 mt-1">在這裡分享你的開發理念、養寵物心得，或是與大家交流技術！</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
          我
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            placeholder="今天修了什麼 Bug？寵物又變胖了嗎？分享一下吧！"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> 發佈
            </button>
          </div>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                post.isUser ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {post.author.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200 text-sm">{post.author}</span>
                  <span className="text-[10px] text-slate-500">{getTimeAgo(post.timestamp)}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <button 
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                    <MessageSquare className="w-4 h-4" /> 回覆
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
