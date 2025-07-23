<script>
  import BookmarkLink from './BookmarkLink.svelte';
  import { slide } from 'svelte/transition';

  export let item;
  export let isRoot = false;

  let isExpanded = false;

  function toggle() {
    isExpanded = !isExpanded;
  }
</script>

{#if isRoot}
  <div class="bookmark-folder">
    <div class="folder-title">{item.folder || 'Other Bookmarks'}</div>
    <ul class="bookmark-list">
      {#each item.bookmarks as bookmarkItem}
        <svelte:self item={bookmarkItem} />
      {/each}
    </ul>
  </div>
{:else}
  <li class="bookmark-item">
    {#if item.isSubfolder}
      <div
        class="subfolder-header"
        style="padding-left: {item.depth * 20}px"
        on:click={toggle}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && toggle()}
      >
        <span class="toggle-icon">{isExpanded ? '▼' : '►'}</span>
        <span class="folder-icon">📁</span>
        {item.title}
      </div>
      {#if isExpanded && item.children}
        <ul class="bookmark-list" transition:slide|local>
          {#each item.children as subItem}
            <svelte:self item={subItem} />
          {/each}
        </ul>
      {/if}
    {:else}
      <div style="padding-left: {item.depth * 20}px">
        <BookmarkLink bookmark={item} />
      </div>
    {/if}
  </li>
{/if}

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
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2d3748;
    padding: 8px 0;
    font-size: 14px;
    cursor: pointer;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }

  .toggle-icon {
    margin-right: 8px;
    font-size: 12px;
    width: 12px;
    text-align: center;
  }

  .folder-icon {
    margin-right: 8px;
  }
</style>