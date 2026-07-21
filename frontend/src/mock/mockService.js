import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_COMMENTS, TRENDING_TOPICS } from './mockData';

const STORAGE_KEYS = {
  POSTS: 'blogsphere_mock_posts',
  CATEGORIES: 'blogsphere_mock_categories',
  BOOKMARKS: 'blogsphere_mock_bookmarks',
  COMMENTS: 'blogsphere_mock_comments',
  USER: 'blogsphere_mock_current_user'
};

const getStoredItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
};

const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
};

// Initialize localStorage with initial dataset and clean up legacy data
const storedPosts = getStoredItem(STORAGE_KEYS.POSTS, []);
const hasLegacyPosts = storedPosts.some(p => p.user && p.user.name !== 'Ankit Kumar');
const hasGarbagePosts = storedPosts.some(p => !p.title || p.title.trim().length <= 3);
if (hasLegacyPosts || hasGarbagePosts || storedPosts.length === 0) {
  // Preserve any valid posts written by Ankit, merge with seeded INITIAL_POSTS
  const validUserPosts = storedPosts.filter(
    p => p.user?.name === 'Ankit Kumar' && p.title?.trim().length > 3
  );
  const seededIds = new Set(INITIAL_POSTS.map(p => p.id));
  const userExtras = validUserPosts.filter(p => !seededIds.has(p.id));
  setStoredItem(STORAGE_KEYS.POSTS, [...INITIAL_POSTS, ...userExtras]);
}

if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
  setStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

const storedComments = getStoredItem(STORAGE_KEYS.COMMENTS, []);
const hasLegacyComments = storedComments.some(c => c.user && c.user.name !== 'Ankit Kumar');
if (hasLegacyComments || storedComments.length === 0) {
  setStoredItem(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
}

if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
  setStoredItem(STORAGE_KEYS.BOOKMARKS, [101, 103]);
}

const storedUser = getStoredItem(STORAGE_KEYS.USER, null);
if (!storedUser || storedUser.name !== 'Ankit Kumar') {
  setStoredItem(STORAGE_KEYS.USER, INITIAL_USERS[0]);
}

const simulateDelay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Get current session user
  getCurrentUser: () => getStoredItem(STORAGE_KEYS.USER, INITIAL_USERS[0]),
  
  setCurrentUser: (user) => {
    setStoredItem(STORAGE_KEYS.USER, user);
    return user;
  },

  // Posts API
  getPosts: async (pageNumber = 0, pageSize = 6) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const start = pageNumber * pageSize;
    const paginated = posts.slice(start, start + pageSize);
    return {
      content: paginated,
      pageNumber,
      pageSize,
      totalElements: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      lastPage: start + pageSize >= posts.length
    };
  },

  getPostById: async (id) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const post = posts.find(p => p.id === Number(id));
    if (!post) throw new Error('Post not found');
    return post;
  },

  searchPosts: async (keyword, pageNumber = 0, pageSize = 6) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const q = keyword.toLowerCase().trim();
    
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q))) ||
      (post.category && post.category.categoryName.toLowerCase().includes(q)) ||
      (post.user && post.user.name.toLowerCase().includes(q))
    );

    const start = pageNumber * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      content: paginated,
      pageNumber,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      lastPage: start + pageSize >= filtered.length
    };
  },

  getPostsByCategory: async (categoryId, pageNumber = 0, pageSize = 6) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const filtered = posts.filter(p => p.category && p.category.id === Number(categoryId));
    const start = pageNumber * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      content: paginated,
      pageNumber,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      lastPage: start + pageSize >= filtered.length
    };
  },

  getPostsByUser: async (userId, pageNumber = 0, pageSize = 6) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const filtered = posts.filter(p => p.user && p.user.id === Number(userId));
    const start = pageNumber * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      content: paginated,
      pageNumber,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      lastPage: start + pageSize >= filtered.length
    };
  },

  createPost: async (postData) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const categories = getStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const currentUser = mockService.getCurrentUser();

    const category = categories.find(c => c.id === Number(postData.categoryId)) || categories[0];

    const newPost = {
      id: Date.now(),
      title: postData.title,
      slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: postData.content,
      imageName: postData.imageName || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      readTime: `${Math.max(2, Math.ceil(postData.content.length / 500))} min read`,
      claps: 1,
      bookmarksCount: 0,
      category,
      user: currentUser,
      tags: postData.tags || [category.categoryName]
    };

    const updated = [newPost, ...posts];
    setStoredItem(STORAGE_KEYS.POSTS, updated);
    return newPost;
  },

  updatePost: async (id, postData) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const categories = getStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const category = categories.find(c => c.id === Number(postData.categoryId)) || categories[0];

    const index = posts.findIndex(p => p.id === Number(id));
    if (index === -1) throw new Error('Post not found');

    const updatedPost = {
      ...posts[index],
      title: postData.title,
      content: postData.content,
      category,
      imageName: postData.imageName || posts[index].imageName
    };

    posts[index] = updatedPost;
    setStoredItem(STORAGE_KEYS.POSTS, posts);
    return updatedPost;
  },

  deletePost: async (id) => {
    await simulateDelay();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const filtered = posts.filter(p => p.id !== Number(id));
    setStoredItem(STORAGE_KEYS.POSTS, filtered);
    return { success: true };
  },

  // Claps & Bookmarks
  toggleClap: async (postId) => {
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const index = posts.findIndex(p => p.id === Number(postId));
    if (index !== -1) {
      posts[index].claps = (posts[index].claps || 0) + 1;
      setStoredItem(STORAGE_KEYS.POSTS, posts);
      return posts[index].claps;
    }
    return 0;
  },

  toggleBookmark: async (postId) => {
    const bookmarks = getStoredItem(STORAGE_KEYS.BOOKMARKS, []);
    const idNum = Number(postId);
    const exists = bookmarks.includes(idNum);
    let updated;
    if (exists) {
      updated = bookmarks.filter(b => b !== idNum);
    } else {
      updated = [...bookmarks, idNum];
    }
    setStoredItem(STORAGE_KEYS.BOOKMARKS, updated);
    return !exists;
  },

  getBookmarks: () => getStoredItem(STORAGE_KEYS.BOOKMARKS, []),

  getBookmarkedPosts: async () => {
    await simulateDelay();
    const bookmarks = getStoredItem(STORAGE_KEYS.BOOKMARKS, []);
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    return posts.filter(p => bookmarks.includes(p.id));
  },

  // Categories API
  getCategories: async () => {
    await simulateDelay();
    return getStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // Trending Topics API
  getTrendingTopics: () => TRENDING_TOPICS,

  // Comments API
  getPostComments: async (postId) => {
    await simulateDelay();
    const comments = getStoredItem(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    return comments.filter(c => c.postId === Number(postId));
  },

  addComment: async (postId, contentText) => {
    await simulateDelay();
    const comments = getStoredItem(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const currentUser = mockService.getCurrentUser();

    const newComment = {
      id: Date.now(),
      postId: Number(postId),
      user: currentUser,
      content: contentText,
      createdAt: new Date().toISOString(),
      likesCount: 0
    };

    const updated = [newComment, ...comments];
    setStoredItem(STORAGE_KEYS.COMMENTS, updated);
    return newComment;
  },

  // Users Profile API
  getUserProfile: async (userId) => {
    await simulateDelay();
    const user = INITIAL_USERS.find(u => u.id === Number(userId)) || mockService.getCurrentUser();
    const posts = getStoredItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const userPosts = posts.filter(p => p.user && p.user.id === user.id);
    const totalClaps = userPosts.reduce((acc, p) => acc + (p.claps || 0), 0);

    return {
      ...user,
      postsCount: userPosts.length,
      totalClaps
    };
  }
};
