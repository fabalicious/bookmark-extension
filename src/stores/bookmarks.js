import { writable, derived } from 'svelte/store';

export const bookmarks = writable([]);
export const searchQuery = writable('');

function processBookmarks(nodes) {
  return nodes.map((node, index) => {
    if (node.url) { // It's a bookmark
      return {
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId,
        isFolder: false,
        index: index,
      };
    } else if (node.children) { // It's a folder
      return {
        id: node.id,
        title: node.title,
        parentId: node.parentId,
        isFolder: true,
        children: processBookmarks(node.children),
        index: index,
      };
    }
  }).filter(Boolean); // Filter out any undefined entries
}

// Check if a bookmark should be displayed
function isValidBookmark(bookmark) {
  // Skip javascript bookmarklets
  if (bookmark.url.startsWith('javascript:')) {
    return false;
  }
  
  // Skip chrome:// URLs with empty titles (likely broken bookmarks)
  if (bookmark.url.startsWith('chrome://') && (!bookmark.title || bookmark.title.trim() === '')) {
    return false;
  }
  
  // Skip bookmarks with empty or very short URLs
  if (!bookmark.url || bookmark.url.length < 4) {
    return false;
  }
  
  return true;
}

function filterTree(nodes, searchTerm) {
  if (!searchTerm) return nodes;

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return nodes.map(node => {
    if (node.isFolder) {
      const filteredChildren = filterTree(node.children, searchTerm);
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
    } else { // It's a bookmark
      const title = node.title || '';
      const url = node.url || '';
      if (title.toLowerCase().includes(lowerCaseSearchTerm) || url.toLowerCase().includes(lowerCaseSearchTerm)) {
        return node;
      }
    }
  }).filter(Boolean);
}

// Derived store for filtered bookmarks
export const filteredBookmarks = derived(
  [bookmarks, searchQuery],
  ([$bookmarks, $searchQuery]) => {
    return filterTree($bookmarks, $searchQuery.trim());
  }
);

// Load bookmarks from Chrome API
export async function loadBookmarks() {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const processedBookmarks = processBookmarks(bookmarkTreeNodes[0].children);
      bookmarks.set(processedBookmarks);
      resolve();
    });
  });
}

export function removeBookmark(id) {
  chrome.bookmarks.remove(id, () => {
    loadBookmarks();
  });
}

export function updateBookmark(id, changes) {
  chrome.bookmarks.update(id, changes, () => {
    loadBookmarks();
  });
}

export function createBookmark(bookmark) {
  chrome.bookmarks.create(bookmark, () => {
    loadBookmarks();
  });
}

export function moveBookmark(id, destination) {
  chrome.bookmarks.move(id, destination, () => {
    loadBookmarks();
  });
}