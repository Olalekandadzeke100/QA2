const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News "newest" page
  await page.goto("https://news.ycombinator.com/newest");

  // Extract first 100 article titles and ranks (if necessary)
  const articles = await page.$$eval('.athing', articles => {
    return articles.slice(0, 100).map(article => ({
      title: article.querySelector('.storylink').innerText, // Extract the title
      time: article.querySelector('.age').innerText // Extract the time (or other criteria)
    }));
  });

  // Check if the articles are sorted (this is a simple example based on time)
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    // Compare articles to see if they are in descending order (newest to oldest)
    if (new Date(articles[i].time) < new Date(articles[i + 1].time)) {
      isSorted = false;
      break;
    }
  }

  // Output the result
  if (isSorted) {
    console.log("Articles are sorted from newest to oldest!");
  } else {
    console.log("Articles are not sorted correctly.");
  }

  // Add 2-minute delay before closing the browser
  console.log("Keeping the browser open for 2 minutes...");
  await new Promise(resolve => setTimeout(resolve, 120000));  // Delay for 2 minutes (120000 ms)

  console.log("Closing browser now...");
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();

