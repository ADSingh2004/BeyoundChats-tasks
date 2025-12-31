const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const BASE_URL = 'https://beyondchats.com/blogs/';

// Helper to fetch HTML
async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function scrapeOldestArticles() {
  console.log('--- Starting Scraper ---');

  // Step 1: Find the Last Page Number
  const $home = await fetchHTML(BASE_URL);
  if (!$home) return;

  // Logic: Look for pagination links. Usually standard classes like .page-numbers
  // Note: This selector depends on the specific WordPress theme. 
  // I am assuming a standard structure: .page-numbers and finding the max number.
  let maxPage = 1;
  $home('.page-numbers').each((i, el) => {
    const num = parseInt($home(el).text());
    if (!isNaN(num) && num > maxPage) {
      maxPage = num;
    }
  });

  console.log(`Detected Last Page: ${maxPage}`);
  
  // Step 2: Collect articles from multiple pages (starting from the last page)
  const allArticleLinks = [];
  let currentPage = maxPage;
  
  // Try to get articles from up to 3 pages backwards
  while (currentPage > 0 && allArticleLinks.length < 10) {
    const pageUrl = currentPage === 1 ? BASE_URL : `${BASE_URL}page/${currentPage}/`;
    console.log(`Fetching Page ${currentPage}: ${pageUrl}`);
    
    const $page = await fetchHTML(pageUrl);
    if (!$page) break;

    // Find article links on this page
    const pageArticles = [];
    $page('article a, .post-title a, .entry-title a, .post-item a, .blog-item a').each((i, el) => {
      const link = $page(el).attr('href');
      if (link && link.includes('/blogs/') && !link.includes('/tag/') && !link.includes('/category/') && !pageArticles.includes(link)) {
        pageArticles.push(link);
      }
    });

    // If no articles found, try broader search
    if (pageArticles.length === 0) {
      $page('a').each((i, el) => {
        const link = $page(el).attr('href');
        if (link && link.includes('/blogs/') && !link.includes('/tag/') && !link.includes('/category/') && !pageArticles.includes(link)) {
          pageArticles.push(link);
        }
      });
    }

    console.log(`Found ${pageArticles.length} articles on page ${currentPage}`);
    allArticleLinks.push(...pageArticles);
    
    currentPage--;
  }

  // Take the first 5 unique articles
  const targets = allArticleLinks.slice(0, 5);
  console.log(`Total articles to scrape: ${targets.length}`);
  console.log(`Article URLs:`, targets);

  // Step 3: Visit each article and extract content
  for (const url of targets) {
    try {
      // Check if exists to avoid duplicates
      const exists = await Article.findOne({ original_url: url });
      if (exists) {
        console.log(`Skipping (Already Exists): ${url}`);
        continue;
      }

      const $article = await fetchHTML(url);
      if (!$article) {
        console.log(`Failed to fetch: ${url}`);
        continue;
      }

      const title = $article('h1').first().text().trim();
      
      // Extract text from the main content area (heuristics)
      // Common WP classes: .entry-content, .post-content, article
      const content = $article('.entry-content, .post_content, article').text().trim();

      if (title && content) {
        await Article.create({
          title,
          original_url: url,
          original_content: content
        });
        console.log(`✅ Saved: ${title}`);
      } else {
        console.log(`⚠️ Skipped (No content): ${url} - Title: "${title}" Content length: ${content.length}`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${url}:`, err.message);
    }
  }
  console.log('--- Scraping Completed ---');
}

module.exports = { scrapeOldestArticles };