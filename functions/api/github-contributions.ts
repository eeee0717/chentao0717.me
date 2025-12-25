import * as cheerio from 'cheerio'

interface ContributionDay {
  date: string
  count: number
  color: string
  intensity: number
}

interface YearData {
  year: string
  total: number
  range: {
    start: string
    end: string
  }
}

// GitHub contribution level to color mapping
const COLOR_MAP: Record<string, string> = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
}

export async function onRequest(context: { request: Request }) {
  const url = new URL(context.request.url)
  const username = url.searchParams.get('username') || 'eeee0717'

  try {
    // Fetch GitHub profile page
    const response = await fetch(`https://github.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GitHubContributionsBot/1.0)',
        'x-requested-with': 'XMLHttpRequest',
      },
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch profile: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Parse contribution days
    const $days = $('table.ContributionCalendar-grid td.ContributionCalendar-day')

    // Get total contributions text
    const totalText = $('.js-yearly-contributions h2').text().trim()
    const totalMatch = totalText.match(/^([0-9,]+)/)
    const total = totalMatch ? Number.parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0

    // Parse each contribution day
    const contributions: ContributionDay[] = []
    let startDate = ''
    let endDate = ''

    $days.each((index, day) => {
      const $day = $(day)
      const date = $day.attr('data-date')
      const level = $day.attr('data-level') || '0'

      if (date) {
        if (index === 0)
          startDate = date
        endDate = date

        contributions.push({
          date,
          count: Number.parseInt(level, 10), // Using level as count for intensity visualization
          color: COLOR_MAP[level] || COLOR_MAP['0'],
          intensity: Number.parseInt(level, 10),
        })
      }
    })

    // Build response data structure matching github-contributions-canvas format
    const currentYear = new Date().getFullYear().toString()
    const data = {
      years: [
        {
          year: currentYear,
          total,
          range: {
            start: startDate,
            end: endDate,
          },
        },
      ] as YearData[],
      contributions,
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
  catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch contributions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
