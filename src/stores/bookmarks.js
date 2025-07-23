import { writable, derived } from 'svelte/store';

export const bookmarks = writable([]);
export const searchQuery = writable('');

// Process bookmark tree recursively to create a nested structure
function processBookmarks(nodes, depth = 0) {
  const bookmarks = [];
  
  nodes.forEach(node => {
    if (node.children) {
      // This is a folder
      bookmarks.push({
        isSubfolder: true,
        title: node.title,
        children: processBookmarks(node.children, depth + 1),
        depth: depth
      });
    } else if (node.url && isValidBookmark(node)) {
      // This is a valid bookmark
      bookmarks.push({
        title: node.title,
        url: node.url,
        depth: depth,
        isSubfolder: false
      });
    }
  });
  
  return bookmarks;
}

// Group bookmarks by their top-level folder
function groupBookmarksByTopLevelFolder(bookmarkNodes) {
    const topLevelFolders = bookmarkNodes[0]?.children || [];
    return topLevelFolders.map(folder => {
        return {
            folder: folder.title,
            bookmarks: processBookmarks(folder.children || [])
        };
    });
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

// Derived store for filtered bookmarks
export const filteredBookmarks = derived(
  [bookmarks, searchQuery],
  ([$bookmarks, $searchQuery]) => {
    if (!$searchQuery.trim()) {
      return $bookmarks;
    }

    const searchTerm = $searchQuery.toLowerCase();
    const filtered = [];

    $bookmarks.forEach(folder => {
      const matchingBookmarks = folder.bookmarks.filter(bookmark => {
        const title = bookmark.title || '';
        const url = bookmark.url || '';
        return title.toLowerCase().includes(searchTerm) ||
               url.toLowerCase().includes(searchTerm);
      });

      if (matchingBookmarks.length > 0) {
        filtered.push({
          folder: folder.folder,
          bookmarks: matchingBookmarks
        });
      }
    });

    return filtered;
  }
);

// Load bookmarks from Chrome API
export async function loadBookmarks() {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const groupedBookmarks = groupBookmarksByTopLevelFolder(bookmarkTreeNodes);
      bookmarks.set(groupedBookmarks);
      resolve();
    });
  });
}