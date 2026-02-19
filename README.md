# Blockparty — Modal

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0)
[![WordPress: 6.8+](https://img.shields.io/badge/WordPress-6.8+-green.svg)](https://wordpress.org/)
[![PHP: 8.1+](https://img.shields.io/badge/PHP-8.1+-purple.svg)](https://php.net/)

A WordPress plugin that adds a custom Gutenberg block to display a modal dialog in the editor and on the frontend. The modal opens when a trigger (e.g. a button) is activated.

## 📋 Description

Blockparty Modal is a WordPress plugin that lets you add accessible modal dialogs to your content via the Gutenberg block editor. You define the modal content and behaviour in the editor; on the frontend, the modal is shown when the user activates a linked trigger (such as a button block).

### ✨ Features

- **Native Gutenberg Block**: Full integration with the WordPress block editor
- **Modal dialog**: Uses the native `<dialog>` element for semantics and accessibility
- **Configurable content**: Title (with heading level), rich text content, and optional close button
- **Close behaviour**: Choose how the modal closes — click outside, close button only, or prevent closing by backdrop
- **Trigger linking**: Link a block to open a specific modal via `linkedModalId`; by default only the Button block is allowed as a trigger (filterable)
- **Stable modal ID**: Each modal can have a unique ID for trigger association
- **Layout & styling**: Supports wide and full-width alignment, dimensions, colors, and spacing
- **Internationalized**: Multilingual support with translation files (French included)
- **View script**: Frontend script handles opening/closing and focus management

## 🔧 Requirements

- **WordPress**: Version 6.8 or higher
- **PHP**: Version 8.1 or higher
- **PHP Extension**: ext-json

## 📦 Installation

### Installation via Composer

```bash
composer require beapi/blockparty-modal
```

### Manual Installation

1. Download the latest version of the plugin
2. Extract the archive to the `/wp-content/plugins/` folder
3. Activate the plugin from the WordPress "Plugins" menu

### Development Installation

```bash
# Clone the repository
git clone https://github.com/BeAPI/blockparty-modal.git
cd blockparty-modal

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Build the assets
npm run build
```

## 🚀 Usage

1. Open the Gutenberg block editor
2. Add a **Modal** block (e.g. search for "Modal" in the Widgets category)
3. Configure the modal:
   - **Title** and **Heading level** for the dialog heading
   - **Content** (rich text) for the body
   - **Modal ID** — set a unique ID so another block can open this modal (optional)
   - **Close behaviour** — "Any" (click outside or close button), "Close button only", or "None"
   - **Close button** — show or hide the close button
   - **Prevent scroll** — lock body scroll when the modal is open
4. To open the modal from a trigger block:
   - Add a **Button** block (by default, only the Button block can be a modal trigger)
   - In the block sidebar, open **Attached modal** and select the modal to open
   - On the frontend, clicking that button will open the corresponding modal

### Blocks allowed as modal triggers

By default, only the **core/button** block can be linked to a modal. To allow other blocks (e.g. paragraph, image, or custom blocks), use the filter `blockparty_modal_trigger_allowed_blocks` in your theme or plugin:

```php
add_filter( 'blockparty_modal_trigger_allowed_blocks', function ( $blocks ) {
    $blocks[] = 'core/paragraph';
    $blocks[] = 'my-plugin/cta';
    return $blocks;
} );
```

- **Filter name:** `blockparty_modal_trigger_allowed_blocks`
- **Parameters:** `array` — List of block names (e.g. `'core/button'`).
- **Default:** `array( 'core/button' )`

## 🛠️ Development

### Project Structure

```
blockparty-modal/
├── src/                         # Block sources
│   └── blockparty-modal/
│       ├── block.json           # Block configuration
│       ├── edit.js              # Edit component
│       ├── save.js              # Save component
│       ├── view.js              # Frontend open/close logic
│       ├── index.js             # Entry point
│       ├── utils.js             # Helpers (e.g. stable modal ID)
│       ├── editor.scss          # Editor styles
│       └── style.scss           # Frontend styles
├── build/                       # Compiled assets (blocks-manifest.php, etc.)
├── languages/                   # Translation files
├── blockparty-modal.php         # Main plugin file
├── composer.json                # PHP dependencies
└── package.json                 # JavaScript dependencies
```

### Available Scripts

#### JavaScript

```bash
# Development with hot reload
npm start

# Production build
npm run build

# JavaScript linter
npm run lint:js

# CSS linter
npm run lint:css

# Code formatting
npm run format

# Create plugin ZIP archive
npm run plugin-zip

# Start local development environment
npm run start:env

# Stop local development environment
npm run stop:env
```

#### PHP

```bash
# Check code with PHP_CodeSniffer
composer cs

# Automatically fix code
composer cb

# Analyze with Psalm
composer psalm

# Run unit tests
composer phpunit
```

### Coding Standards

The project follows WordPress coding standards:

- **WPCS** (WordPress Coding Standards) for PHP
- **ESLint** with WordPress rules for JavaScript
- **Psalm** for PHP static analysis
- **GrumPHP** to automate pre-commit checks

### Development Environment Setup

The plugin uses `@wordpress/env` to create a local WordPress development environment:

```bash
# Start the environment
npm run start:env

# Access WordPress
# URL: http://localhost:8888
# Default credentials: admin / password

# Stop the environment
npm run stop:env
```

## 🔍 Code Quality

The project integrates several quality tools:

- **PHP_CodeSniffer**: PHP coding standards verification
- **Psalm**: PHP static code analysis
- **PHPCompatibility**: PHP compatibility verification
- **PHP Parallel Lint**: PHP syntax error detection
- **GrumPHP**: Pre-commit checks automation

## 🌍 Internationalization

The plugin is fully internationalized (text domain: `blockparty-modal`). Translation files are available in the `languages/` folder.

### Available Languages

- English (default)
- French

### Adding a Translation

1. Use the `languages/blockparty-modal.pot` file as a base
2. Create your `.po` and `.mo` files
3. Place them in the `languages/` folder

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Make sure your code:

- Follows WordPress coding standards
- Passes all quality tests (PHPCS, Psalm, ESLint)
- Is properly documented
- Includes translations if necessary

## 📄 License

This plugin is distributed under the GPL-2.0-or-later license. See the [LICENSE](LICENSE) file for more details.

## 👥 Authors

**Be API Technical Team**

- Email: <technical@beapi.fr>
- Website: [https://beapi.fr](https://beapi.fr)

## 🔗 Useful Links

- [WordPress Block Editor Documentation](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [HTML dialog element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

## 📝 Changelog

See [readme.txt](readme.txt) for the full version history. Recent highlights:

- **1.0.3**
  - Fix: prevent adding linkedModalId attribute to non allowed blocks.

- **1.0.2**
  - Filter `blockparty_modal_trigger_allowed_blocks` to control which blocks can be modal triggers; dialog margin and InnerBlocks fixes.
  - Crawl Modal blocks from patterns
  - Set min required PHP version to 8.1
  - Style issues

- **1.0.1**
  - Filter `blockparty_modal_trigger_allowed_blocks` to control which blocks can be modal triggers; dialog margin and InnerBlocks fixes.

- **1.0.0**
  - Initial release (Modal block, trigger linking, close behaviour, i18n).

---

Developed with ❤️ by [Be API](https://beapi.fr)
