import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const SitemapGenerator = await require('sitemap-generator')
    const cron = await require('node-cron')

    // create generator
    const generator = SitemapGenerator('https://kasihkaruniakekalpt.com', {
      stripQuerystring: false,
      filepath: Env.get('SITEMAP_PATH'),
      lastMod: true,
      priorityMap: [1.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0],
    })
    generator.on('done', () => {
      // sitemaps created
      const date = new Date()
      console.log(`${date.toISOString()}: mapping done`)
    })

    // start the crawler
    generator.start()

    cron.schedule('* * */1 * *', async () => {
      // register event listeners
      generator.on('done', () => {
        // sitemaps created
        const date = new Date()
        console.log(`${date.toISOString()}: mapping done`)
      })

      // start the crawler
      generator.start()
    })
    // console.log('console anything')
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
