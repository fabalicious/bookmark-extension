<script>
  import BookmarkLink from './BookmarkLink.svelte';
  import { moveBookmark } from '../stores/bookmarks.js';
  export let folder;

  let isDragOver = false;

  function handleDrop(e) {
    e.preventDefault();
    isDragOver = false;
    const bookmark = JSON.parse(e.dataTransfer.getData('text/plain'));
    moveBookmark(bookmark.id, { parentId: folder.id });
  }
</script>

<div
  class="bookmark-folder"
  class:drag-over={isDragOver}
  on:dragover|preventDefault={(e) => {
    isDragOver = true;
  }}
  on:dragleave|preventDefault={(e) => {
    isDragOver = false;
  }}
  on:drop={handleDrop}
>
  <div class="folder-title">{folder.title || 'Unnamed Folder'}</div>
  <ul class="bookmark-list">
    {#each folder.children as node (node.id)}
      <li class="bookmark-item">
        {#if node.isFolder}
          <svelte:self folder={node} />
        {:else}
          <BookmarkLink bookmark={node} />
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .bookmark-folder {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .bookmark-folder:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .drag-over {
    background: rgba(102, 126, 234, 0.2);
  }

  .folder-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }

  .bookmark-list {
    list-style: none;
  }

  .bookmark-item {
    margin-bottom: 4px;
  }

  .subfolder-header {
    font-weight: 600;
    color: #2d3748;
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }
</style>