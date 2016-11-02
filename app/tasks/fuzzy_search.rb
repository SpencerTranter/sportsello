class Fuzzy_Search

  def initialize(query)
    @query = query
    @games = Game.all
    @venues = Venue.all
    @venue_results = []
    @game_results = []
  end

  def searchVenues()
    @venues.each do |venue|
      search_table(@query, venue.id, 'venues').each do |row|
        @venue_results.push(venue)
      end
    end
    @venue_results
  end

  def searchGames()
    @games.each do |game|
      flag = false
      search_table(@query, game.sport_id, 'sports').each do |row|
        @game_results.push(game)
        flag = true
      end
      next unless !flag
      search_table(@query, game.team1_id, 'teams').each do |row|
        @game_results.push(game)
        flag = true
      end
      next unless !flag
      search_table(@query, game.team2_id, 'teams').each do |row|
        @game_results.push(game)
      end
    end
    @game_results
  end

  private
    def search_table(query, id, table)
      query = query.split(' ').join('% | %')
      sql = "SELECT id FROM #{table} WHERE (to_tsvector(name) @@ to_tsquery('#{query}')) AND id = #{id};"
      results = ActiveRecord::Base.connection.execute(sql)
    end

end