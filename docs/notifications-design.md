# Notifications Page Design Guidelines

This document outlines the UX and UI principles for the notifications page. The layout draws inspiration from social feeds used in Threads and Instagram.

## Layout

- Mobile and desktop share a single column feed for consistency.
- Each notification item is a flex row with the sender avatar on the left, message content in the middle and a small time stamp beneath.
- Unread items use a subtle background (`bg-gray-100` on light theme, `bg-gray-800` on dark theme) and display a brand colored dot on the far right.
- The page header simply reads **"Notifications"** and is followed by the list of items.

## Item Content

- Show the sender's profile picture. Use a `w-10 h-10 rounded-full` image element.
- The text uses `text-sm` for readability. Links should gain an underline on hover.
- A timestamp with `text-xs text-gray-400` appears below the message.
- Types of notifications share common phrasing:
  - Like → `username liked your post`.
  - Comment → `username commented on your post`.
  - Reply → `username replied to your comment`.
  - Follow → `username started following you`.

## Colors

- The brand color `#119C99` is used for the unread dot and link accents.
- Background color follows existing theme classes (`bg-[#212121]` etc.).

## Interaction

- Tapping a notification opens the referenced post or profile in a new page.
- Unread items are marked as read once the list is viewed.

These guidelines keep the feed minimal and focus on clear communication much like the activity feeds on Threads or Instagram.
