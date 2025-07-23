<script>
  export let value = '';
</script>

<div class="search-container">
  <input 
    type="text" 
    class="search-box" 
    placeholder="Search bookmarks..." 
    bind:value
  />
</div>