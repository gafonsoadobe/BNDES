# cards-featured

Custom **cards** block. Purpose: featured programs.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Design notes

- Accent bar color is assigned by card position (content carries no color): 4n+1 ocre `#9e6900`, 4n+2 green `var(--brand-menu-green)`, 4n+3 tertiary blue `#628aa1`, 4n+4 ocre — matching the source homepage order.
- Desktop (>= 900px): 4 columns, 6px gap, block breaks out of the content column to 97vw (source container width).
- Mobile: one card per view, horizontal scroll-snap with previous/next arrow buttons (source owl carousel).

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
