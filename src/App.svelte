<script>
  import { onMount } from 'svelte';
  import BookmarkFolder from './components/BookmarkFolder.svelte';
  import SearchBox from './components/SearchBox.svelte';
  import { bookmarks, filteredBookmarks, searchQuery, loadBookmarks, createBookmark } from './stores/bookmarks.js';

  let loading = true;
  let showAddForm = false;
  let newBookmarkTitle = '';
  let newBookmarkUrl = '';
  let newBookmarkParentId = '1'; // Default to bookmarks bar

  onMount(async () => {
    await loadBookmarks();
    loading = false;
  });

  let totalBookmarks = 0;

  function countBookmarks(nodes) {
    let count = 0;
    for (const node of nodes) {
      if (node.isFolder) {
        count += countBookmarks(node.children);
      } else {
        count++;
      }
    }
    return count;
  }

  $: totalBookmarks = countBookmarks($filteredBookmarks);

  function handleAddBookmark() {
    createBookmark({
      title: newBookmarkTitle,
      url: newBookmarkUrl,
      parentId: newBookmarkParentId,
    });
    showAddForm = false;
    newBookmarkTitle = '';
    newBookmarkUrl = '';
  }
</script>

{#if showAddForm}
  <div class="modal-overlay" on:click={() => (showAddForm = false)}>
    <div class="modal-content" on:click|stopPropagation>
      <h2>Add New Bookmark</h2>
      <form on:submit|preventDefault={handleAddBookmark}>
        <input type="text" placeholder="Title" bind:value={newBookmarkTitle} required />
        <input type="url" placeholder="URL" bind:value={newBookmarkUrl} required />
        <button type="submit">Add</button>
        <button type="button" on:click={() => (showAddForm = false)}>Cancel</button>
      </form>
    </div>
  </div>
{/if}

<div class="container">
  <div class="header">
    <h1>My Bookmarks</h1>
    <button on:click={() => (showAddForm = true)}>+ Add Bookmark</button>
  </div>

  <SearchBox bind:value={$searchQuery} />

  {#if loading}
    <div class="loading">Loading bookmarks...</div>
  {:else if $filteredBookmarks.length === 0}
    <div class="no-results">No bookmarks found</div>
  {:else}
    <div class="stats">
      {totalBookmarks} bookmarks found
    </div>

    <div class="bookmarks-grid">
      {#each $filteredBookmarks as node (node.id)}
        {#if node.isFolder}
          <BookmarkFolder folder={node} />
        {:else}
          <BookmarkLink bookmark={node} />
        {/if}
      {/each}
    </div>
  {/if}
</div>