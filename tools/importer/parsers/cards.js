/**
 * Cards block parser for BECU homepage product/service cards.
 * Extracts cards from secondary-promo, retail-promo, and blog-article-promo components.
 *
 * Source structure: .component-secondary-promo, .component-retail-promo,
 *   .component-blog-article-promo
 * Each card has: img + heading (h4) + description text, wrapped in an anchor link
 *
 * Target EDS block: Cards (2-column: image | content)
 */
export default function parse(element, { document }) {
  const cards = [];

  const cardElements = element.querySelectorAll(
    '.component-secondary-promo, .component-retail-promo, .component-blog-article-promo',
  );

  cardElements.forEach((card) => {
    const link = card.querySelector('a');
    const img = card.querySelector('img');
    const heading = card.querySelector('h4');
    const promoText = card.querySelector('.promo-text p, .promo-text, .promo-details .summary');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Build content cell
    const contentCell = document.createElement('div');
    if (heading && link) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = heading.textContent.trim();
      strong.appendChild(a);
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
    if (promoText) {
      const p = document.createElement('p');
      p.textContent = promoText.textContent.trim();
      contentCell.appendChild(p);
    }

    cards.push([imageCell, contentCell]);
  });

  return {
    blockName: 'cards',
    rows: cards,
  };
}
