import { writable, derived } from 'svelte/store';

export const bookmarks = writable([]);
export const searchQuery = writable('');

// Process bookmark tree recursively to create flat structure with nesting info
function processBookmarks(nodes, folderName = '', depth = 0) {
  const bookmarks = [];
  
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      // This is a folder with children
      if (depth > 0) {
        // Add the folder itself as a visual separator (except for root folders)
        bookmarks.push({
          isFolder: true,
          title: node.title,
          depth: depth,
          folder: folderName
        });
      }
      
      // Process children with increased depth
      const folderBookmarks = processBookmarks(node.children, node.title, depth + 1);
      bookmarks.push(...folderBookmarks);
      
    } else if (node.url && isValidBookmark(node)) {
      // This is a valid bookmark
      bookmarks.push({
        title: node.title,
        url: node.url,
        folder: folderName,
        depth: depth,
        isFolder: false
      });
    }
  });
  
  return bookmarks;
}

// Group flat bookmarks by root folder for display
function groupBookmarksByRootFolder(flatBookmarks) {
  const grouped = {};
  
  flatBookmarks.forEach(bookmark => {
    // Find the root folder (depth 1 items, or items with no specific root)
    let rootFolder = 'Other';
    
    // Traverse up to find root folder name
    if (bookmark.depth === 1) {
      rootFolder = bookmark.folder;
    } else if (bookmark.depth > 1) {
      // For deeper items, we need to identify their root folder
      // This is a simplification - in practice, we'd track the hierarchy better
      rootFolder = bookmark.folder.split(' > ')[0] || bookmark.folder;
    }
    
    if (!grouped[rootFolder]) {
      grouped[rootFolder] = [];
    }
    
    grouped[rootFolder].push(bookmark);
  });
  
  // Convert to array format expected by components
  return Object.entries(grouped).map(([folderName, bookmarks]) => ({
    folder: folderName,
    bookmarks: bookmarks
  }));
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
      // Skip the root node and process its children directly
      const flatBookmarks = processBookmarks(bookmarkTreeNodes[0].children);
      const groupedBookmarks = groupBookmarksByRootFolder(flatBookmarks);
      bookmarks.set(groupedBookmarks);
      resolve();
    });
  });
}