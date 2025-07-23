<script>
  export let bookmark;

  // Get favicon URL for a given website
  function getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd"/></svg>';
    }
  }

  function handleFaviconError(event) {
    event.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd"/></svg>';
  }
</script>

<a href={bookmark.url} class="bookmark-link" target="_blank" rel="noopener">
  <img 
    src={getFaviconUrl(bookmark.url)} 
    alt="" 
    class="bookmark-favicon"
    on:error={handleFaviconError}
  />
  <span class="bookmark-title">{bookmark.title || bookmark.url || 'Untitled'}</span>
</a>

<style>
  .bookmark-link {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    color: #2d3748;
    transition: color 0.2s ease;
    border-radius: 8px;
  }

  .bookmark-link:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  .bookmark-favicon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    border-radius: 2px;
  }

  .bookmark-title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
</style>