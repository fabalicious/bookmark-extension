# Bookmark Sync Chrome Extension

A beautiful Chrome extension that replaces your new tab page with an organized view of all your bookmarks.

## Features

- 🔍 **Search bookmarks** by title or URL
- 📁 **Organized by folders** with hierarchical display
- 🎨 **Beautiful UI** with glassmorphism effects
- ⚡ **Fast and lightweight** built with Svelte
- 🔄 **Automatic sync** uses Chrome's built-in bookmark syncing

## Installation

### Development Mode
1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Move the built HTML file: `mv dist/src/newtab.html dist/ && rm -rf dist/src`
5. Copy manifest: `cp manifest.json dist/`
6. Load the `dist/` folder as an unpacked extension in Chrome

### Production Build
1. Download the latest release from GitHub
2. Load the extension folder in Chrome Extensions (Developer Mode)

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch for changes during development
npm run watch
```

## Tech Stack

- **Svelte** - Reactive UI framework
- **Vite** - Build tool and dev server
- **Chrome Extensions API** - Access to bookmarks
- **Vanilla CSS** - Custom styling with modern effects

## Roadmap

- [ ] Nested folder display improvements
- [ ] Dark mode toggle
- [ ] Bookmark editing capabilities
- [ ] Export/import functionality
- [ ] Custom bookmark organization
- [ ] Recent bookmarks view

## Contributing

Feel free to open issues and pull requests!

## License

MIT License
