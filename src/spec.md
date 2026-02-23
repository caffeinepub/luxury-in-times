# Specification

## Summary
**Goal:** Add multiple photo upload support (up to 5 images per watch) and create a product detail page with an elegant image carousel.

**Planned changes:**
- Update backend Watch type to store images as an array of Blobs (up to 5 per watch)
- Modify AddWatchForm to support uploading multiple images with preview thumbnails
- Update EditWatchModal to display, remove, and add multiple images
- Create ProductDetailPage component at /products/:id with image carousel and full watch details
- Make ProductCard clickable to navigate to product detail page
- Update all components (ProductCard, FeaturedWatches, WatchManagementList) to display first image from array
- Create migration script to convert existing single image data to array format

**User-visible outcome:** Customers can view multiple photos of each watch through an elegant carousel on product detail pages. Admins can upload and manage up to 5 photos per watch in the admin panel.
