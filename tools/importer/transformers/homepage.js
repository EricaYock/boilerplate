/**
 * Page transformer for BECU homepage template.
 * Extracts main content sections and transforms them into EDS-compatible structure.
 *
 * Sections:
 * 1. Hero carousel (carousel block)
 * 2. Intro text (default content - heading + paragraph)
 * 3. Product/service cards (cards block)
 */
export default function transform(document) {
  const main = document.querySelector('main#maincontent');
  if (!main) return null;

  const sections = [];

  // Section 1: Hero Carousel
  const heroCarousel = main.querySelector('.hero-carousel-container .component-hero-carousel');
  if (heroCarousel) {
    sections.push({
      type: 'block',
      blockName: 'carousel',
      element: heroCarousel,
    });
  }

  // Section 2: Intro text (default content)
  const introContainer = main.querySelector('.container.position-static');
  if (introContainer) {
    const heading = introContainer.querySelector('h1, h2');
    const paragraph = introContainer.querySelector('p');

    sections.push({
      type: 'default-content',
      content: {
        heading: heading ? heading.textContent.trim() : '',
        headingLevel: heading ? heading.tagName.toLowerCase() : 'h2',
        text: paragraph ? paragraph.innerHTML : '',
      },
    });
  }

  // Section 3: Product/Service Cards
  const cardsContainer = main.querySelector('.fullbleed-wrapper section.container');
  if (cardsContainer) {
    sections.push({
      type: 'block',
      blockName: 'cards',
      element: cardsContainer,
    });
  }

  // Page metadata
  const metadata = {
    title: document.querySelector('meta[property="og:title"]')?.content
      || document.title || '',
    description: document.querySelector('meta[name="description"]')?.content || '',
    'og:image': document.querySelector('meta[property="og:image"]')?.content || '',
  };

  return { sections, metadata };
}
