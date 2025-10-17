// api/scrapeJobs.js
// This is a Vercel serverless function that scrapes job listings

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jobs = [];
    
    // Keywords to search for
    const keywords = ['seasonal', 'temporary', 'part-time', 'holiday', 'warehouse', 'retail'];
    const location = 'Redding, CA';
    
    // INDEED JOBS
    try {
      const indeedJobs = await scrapeIndeed(keywords, location);
      jobs.push(...indeedJobs);
    } catch (err) {
      console.log('Indeed scrape failed:', err.message);
    }

    // CRAIGSLIST JOBS
    try {
      const craigslistJobs = await scrapeCraigslist(keywords, location);
      jobs.push(...craigslistJobs);
    } catch (err) {
      console.log('Craigslist scrape failed:', err.message);
    }

    // RETAILER DIRECT JOBS
    try {
      const retailerJobs = await scrapeRetailers();
      jobs.push(...retailerJobs);
    } catch (err) {
      console.log('Retailer scrape failed:', err.message);
    }

    // Remove duplicates
    const uniqueJobs = Array.from(
      new Map(jobs.map(job => [job.url, job])).values()
    );

    // Filter out hospitality
    const filteredJobs = uniqueJobs.filter(job => 
      !job.description.toLowerCase().includes('hospitality') &&
      !job.description.toLowerCase().includes('restaurant') &&
      !job.description.toLowerCase().includes('hotel') &&
      !job.description.toLowerCase().includes('food service')
    );

    return res.status(200).json({
      success: true,
      count: filteredJobs.length,
      jobs: filteredJobs.slice(0, 50), // Return max 50 jobs
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scraper error:', error);
    return res.status(500).json({ 
      error: 'Failed to scrape jobs',
      message: error.message 
    });
  }
}

async function scrapeIndeed(keywords, location) {
  const jobs = [];
  
  // Indeed search URL - returns HTML that we parse
  for (const keyword of keywords.slice(0, 2)) { // Limit to 2 keywords to avoid rate limiting
    try {
      const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}&jt=seasonal`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) continue;

      const html = await response.text();
      
      // Parse job cards from Indeed HTML
      const jobRegex = /<div class="job_seen_beacon"[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<span[^>]*class="company"[^>]*>([^<]*)<\/span>/g;
      
      let match;
      while ((match = jobRegex.exec(html)) !== null && jobs.length < 20) {
        const jobUrl = match[1].startsWith('http') ? match[1] : 'https://indeed.com' + match[1];
        
        jobs.push({
          id: `indeed-${Date.now()}-${Math.random()}`,
          title: match[2].trim(),
          company: match[3].trim(),
          location: location,
          type: 'Seasonal',
          url: jobUrl,
          source: 'Indeed',
          salary: 'Not specified',
          description: `${keyword} job on Indeed`,
          postedDate: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.log(`Indeed keyword "${keyword}" scrape failed:`, err.message);
    }
  }

  return jobs;
}

async function scrapeCraigslist(keywords, location) {
  const jobs = [];
  
  try {
    // Craigslist for Redding, CA
    const craigslistUrl = 'https://redding.craigslist.org/search/jjj?query=seasonal+temporary+part-time';
    
    const response = await fetch(craigslistUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return jobs;

    const html = await response.text();
    
    // Parse Craigslist listings
    const listingRegex = /<a[^>]*href="([^"]*\/\d+\.html)"[^>]*>([^<]+)<\/a>/g;
    
    let match;
    let count = 0;
    while ((match = listingRegex.exec(html)) !== null && count < 15) {
      jobs.push({
        id: `craigslist-${Date.now()}-${Math.random()}`,
        title: match[2].trim(),
        company: 'Private Employer',
        location: location,
        type: 'Seasonal/Temporary',
        url: match[1].startsWith('http') ? match[1] : 'https://redding.craigslist.org' + match[1],
        source: 'Craigslist',
        salary: 'Not specified',
        description: 'Job posting on Craigslist',
        postedDate: new Date().toISOString(),
      });
      count++;
    }
  } catch (err) {
    console.log('Craigslist scrape failed:', err.message);
  }

  return jobs;
}

async function scrapeRetailers() {
  const jobs = [];
  
  const retailers = [
    {
      name: 'Amazon',
      url: 'https://www.amazon.jobs/en/locations/redding-california',
      keywords: 'seasonal warehouse',
    },
    {
      name: 'Costco',
      url: 'https://www.costco.com/careers',
      keywords: 'seasonal stock',
    },
    {
      name: "Lowe's",
      url: 'https://careers.lowes.com/search-jobs',
      keywords: 'seasonal retail',
    },
    {
      name: 'Home Depot',
      url: 'https://careers.homedepot.com',
      keywords: 'seasonal associate',
    },
    {
      name: 'Dicks Sporting Goods',
      url: 'https://www.dickssportinggoods.com/careers',
      keywords: 'part-time retail',
    },
  ];

  for (const retailer of retailers) {
    try {
      const response = await fetch(retailer.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (response.ok) {
        jobs.push({
          id: `${retailer.name.toLowerCase()}-${Date.now()}`,
          title: `Seasonal/Part-Time Position`,
          company: retailer.name,
          location: 'Redding, CA',
          type: 'Seasonal/Part-Time',
          url: retailer.url,
          source: 'Direct',
          salary: 'Check company site',
          description: `Visit ${retailer.name} careers page for ${retailer.keywords} positions`,
          postedDate: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.log(`${retailer.name} scrape failed:`, err.message);
    }
  }

  return jobs;
}