import cron from 'node-cron'

export function scheduleDailyJob(hour: number, minute: number, job: () => void) {
  // Runs at the specified hour and minute every day
  const cronTime = `${minute} ${hour} * * *`
  return cron.schedule(cronTime, job, { timezone: 'Etc/UTC' })
}

// Example usage:
// scheduleDailyJob(7, 0, () => { console.log('Run daily job at 7:00 UTC') })
