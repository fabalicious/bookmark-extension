<script>
  import BookmarkLink from './BookmarkLink.svelte';
  
  export let folder;
</script>

<div class="bookmark-folder">
  <div class="folder-title">{folder.folder || 'Other Bookmarks'}</div>
  <ul class="bookmark-list">
    {#each folder.bookmarks as item (item.url || item.title)}
      <li class="bookmark-item">
        {#if item.isSubfolder}
          <div class="subfolder-header" style="margin-left: {(item.depth - 1) * 20}px">
            📁 {item.title}
          </div>
        {:else}
          <div style="margin-left: {item.depth * 20}px">
            <BookmarkLink bookmark={item} />
          </div>
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