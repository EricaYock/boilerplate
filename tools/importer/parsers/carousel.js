/**
 * Carousel block parser for BECU homepage hero carousel.
 * Extracts slides from the Slick carousel component.
 *
 * Source structure: .component-hero-carousel > .slick-track > .slick-slide
 * Each slide has: .hero-image-area img + .hero-text-area (headline, description, CTA)
 *
 * Target EDS block: Carousel (2-column: image | content)
 */
export default function parse(element, { document }) {
  const slides = [];
  const seenHeadlines = new Set();

  // Get all slides, filtering out cloned slick slides
  const slideElements = element.querySelectorAll('.slick-slide:not(.slick-cloned) .hero-slide');

  slideElements.forEach((slide) => {
    const img = slide.querySelector('.hero-image-area img');
    const textArea = slide.querySelector('.hero-text-area .hero-inner');

    if (!textArea) return;

    const headline = textArea.querySelector('.headline');
    const headlineText = headline ? headline.textContent.trim() : '';

    // Skip duplicate slides
    if (seenHeadlines.has(headlineText)) return;
    seenHeadlines.add(headlineText);

    const description = textArea.querySelector('.promo-text');
    const cta = textArea.querySelector('.promo-btn, a.hero-promo-button');

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
    if (headline) {
      const h2 = document.createElement('h2');
      h2.textContent = headlineText;
      contentCell.appendChild(h2);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    slides.push([imageCell, contentCell]);
  });

  return {
    blockName: 'carousel',
    rows: slides,
  };
}
