<script>
  import { onMount } from 'svelte';
  import BookmarkFolder from './components/BookmarkFolder.svelte';
  import SearchBox from './components/SearchBox.svelte';
  import { bookmarks, filteredBookmarks, searchQuery, loadBookmarks } from './stores/bookmarks.js';

  let loading = true;

  onMount(async () => {
    await loadBookmarks();
    loading = false;
  });

  $: totalBookmarks = $filteredBookmarks.reduce((total, folder) => 
    total + folder.bookmarks.length, 0);
</script>

<div class="container">
  <div class="header">
    <h1>My Bookmarks</h1>
  </div>
  
  <SearchBox bind:value={$searchQuery} />

  {#if loading}
    <div class="loading">Loading bookmarks...</div>
  {:else if $filteredBookmarks.length === 0}
    <div class="no-results">No bookmarks found</div>
  {:else}
    <div class="stats">
      {totalBookmarks} bookmarks in {$filteredBookmarks.length} folders
    </div>
    
    <div class="bookmarks-grid">
      {#each $filteredBookmarks as folder (folder.folder)}
        <BookmarkFolder item={folder} isRoot={true} />
      {/each}
    </div>
  {/if}
</div>