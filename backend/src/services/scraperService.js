import axios from 'axios';
import cheerio from 'cheerio';
import { CronJob } from 'cron';
import Event from '../models/Event.js';

class ScraperService {
  constructor() {
    this.sources = [
      {
        name: 'What\'s On Sydney',
        url: 'https://whatson.cityofsydney.nsw.gov.au/things-to-do',
        scraper: this.scrapeWhatsOnSydney
      }
      // Add more sources here
    ];
  }

  async scrapeWhatsOnSydney() {
    try {
      const response = await axios.get('https://whatson.cityofsydney.nsw.gov.au/things-to-do');
      const $ = cheerio.load(response.data);
      const events = [];

      $('.event-card').each((_, element) => {
        const title = $(element).find('.event-card__title').text().trim();
        const description = $(element).find('.event-card__description').text().trim();
        const dateText = $(element).find('.event-card__date').text().trim();
        const venue = $(element).find('.event-card__venue').text().trim();
        const ticketUrl = $(element).find('.event-card__link').attr('href');
        const imageUrl = $(element).find('.event-card__image img').attr('src');

        if (title && description && dateText && ticketUrl) {
          events.push({
            title,
            description,
            date: new Date(dateText),
            venue: {
              name: venue,
              city: 'Sydney',
              country: 'Australia'
            },
            ticketUrl: ticketUrl.startsWith('http') ? ticketUrl : `https://whatson.cityofsydney.nsw.gov.au${ticketUrl}`,
            imageUrl,
            source: 'What\'s On Sydney'
          });
        }
      });

      return events;
    } catch (error) {
      console.error('Error scraping What\'s On Sydney:', error);
      return [];
    }
  }

  async scrapeAndStore() {
    console.log('Starting event scraping...');
    
    for (const source of this.sources) {
      try {
        const events = await source.scraper();
        
        for (const eventData of events) {
          // Check if event already exists based on title and date
          const existingEvent = await Event.findOne({
            title: eventData.title,
            date: eventData.date,
            source: eventData.source
          });

          if (!existingEvent) {
            const event = new Event(eventData);
            await event.save();
            console.log(`New event saved: ${eventData.title}`);
          }
        }
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
      }
    }

    console.log('Event scraping completed');
  }

  initializeScraping() {
    // Run scraper immediately
    this.scrapeAndStore();

    // Schedule scraper to run every 6 hours
    new CronJob('0 */6 * * *', () => {
      this.scrapeAndStore();
    }, null, true, 'Australia/Sydney');
  }
}

export default new ScraperService(); 