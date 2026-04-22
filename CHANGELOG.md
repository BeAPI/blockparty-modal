# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.8]

* Add GitHub Actions check and `tests/bin/check-release-version.sh` to validate that release version bumps are consistent across all versioned files.
* Add this changelog file (Keep a Changelog format).
* Update WordPress Playground `blueprint.json` demo page content.
* Run the JavaScript quality workflow when `package.json` changes.
* Exclude the `tests/` directory from plugin distribution archives.
* Remove Psalm from development dependencies and GrumPHP.

## [1.0.7]

* Add block setting for the close button label.

## [1.0.6]

* Fix `blueprint.json` config.

## [1.0.5]

* Add `blueprint.json` to test the plugin on WordPress Playground.
* Add `screen-reader-text` class to close button element when display icon only is selected.

## [1.0.4]

* Filter `blockparty_modal_inner_allowed_blocks` to control allowed blocks in the modal.

## [1.0.3]

* Fix: prevent adding linkedModalId attribute to non allowed blocks.
* Set min required PHP version to 8.1

## [1.0.2]

* Filter `blockparty_modal_trigger_allowed_blocks` to control which blocks can be modal triggers; dialog margin and InnerBlocks fixes.
* Crawl Modal blocks from patterns
* Style issues

## [1.0.1]

* Fix margin style for dialog element; set to auto by default instead of 0.
* Remove dupplicated InnerBlocks.Content

## [1.0.0]

* Initial release
