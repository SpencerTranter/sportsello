class Scheduler
  # Start crawling games a day in advance
  tomorrow = Date.tomorrow

  # Crawl the all the sports
  nhl_games = NhlCrawler.new(tomorrow).crawl
  nba_games = NbaCrawler.new(tomorrow).crawl
  mlb_games = MlbCrawler.new(tomorrow).crawl
end
