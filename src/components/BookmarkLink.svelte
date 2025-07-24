<script>
  import { removeBookmark, updateBookmark } from '../stores/bookmarks.js';
  export let bookmark;

  let editing = false;
  let newTitle = bookmark.title;
  let newUrl = bookmark.url;

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

  function handleDelete() {
    if (confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
      removeBookmark(bookmark.id);
    }
  }

  function handleEdit() {
    editing = true;
  }

  function handleCancel() {
    editing = false;
    newTitle = bookmark.title;
    newUrl = bookmark.url;
  }

  function handleSave() {
    updateBookmark(bookmark.id, { title: newTitle, url: newUrl });
    editing = false;
  }
</script>

<div
  class="bookmark-wrapper"
  on:dragover|preventDefault
  on:drop|stopPropagation={(e) => {
    e.preventDefault();
    const droppedBookmark = JSON.parse(e.dataTransfer.getData('text/plain'));
    moveBookmark(droppedBookmark.id, { parentId: bookmark.parentId, index: bookmark.index });
  }}
>
  <div class="drop-zone" />
  <div
    class="bookmark-container"
    draggable={!editing}
    on:dragstart|self={(e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(bookmark));
      e.dataTransfer.effectAllowed = 'move';
    }}
  >
    {#if editing}
      <div class="edit-form">
        <input type="text" bind:value={newTitle} />
        <input type="text" bind:value={newUrl} />
        <button on:click={handleSave}>Save</button>
        <button on:click={handleCancel}>Cancel</button>
      </div>
    {:else}
      <a href={bookmark.url} class="bookmark-link" target="_blank" rel="noopener">
        <img
          src={getFaviconUrl(bookmark.url)}
          alt=""
          class="bookmark-favicon"
          on:error={handleFaviconError}
        />
        <span class="bookmark-title">{bookmark.title || bookmark.url || 'Untitled'}</span>
      </a>
      <div class="actions">
        <button class="edit-button" on:click={handleEdit}>✎</button>
        <button class="delete-button" on:click={handleDelete}>x</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .edit-form {
    display: flex;
    gap: 5px;
    width: 100%;
  }

  .edit-form input {
    flex-grow: 1;
  }

  .bookmark-wrapper {
    position: relative;
  }

  .bookmark-wrapper:hover .drop-zone {
    opacity: 1;
  }

  .drop-zone {
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(102, 126, 234, 0.5);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .bookmark-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bookmark-link {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    color: #2d3748;
    transition: color 0.2s ease;
    border-radius: 8px;
    flex-grow: 1;
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

  .actions {
    display: flex;
    visibility: hidden;
  }

  .bookmark-container:hover .actions {
    visibility: visible;
  }

  .edit-button, .delete-button {
    background: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    padding: 0 5px;
  }

  .edit-button:hover {
    color: #00f;
  }

  .delete-button:hover {
    color: #f00;
  }
</style>