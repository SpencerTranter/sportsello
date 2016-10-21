require 'date'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

puts "Seeding Data ..."

# Helper functions
# def open_asset(file_name)
#   File.open(Rails.root.join('db', 'seed_assets', file_name))
# end

# Only run on development (local) instances not on production, etc.
raise "Development seeds only (for now)!" unless Rails.env.development?

# Let's do this ...
# Users
User.destroy_all

user = User.create!({
  provider: 'facebook',
  uid: 10202288529331229,
  name: 'Corey Brooks',
  oauth_token: 'EAADzQ4vKSEgBADtIN8mT8d5D5lGZAZChZAc60ZCPT63mPru24ZBTQ4zklkqingfqQYMnZBTKEJh5FuuFTYg4uH7dNwACDZAK4OHPkXJ1ZALW6UZC7b3WYXCeSZAa5r7mLRlEk4HK5tI5vZBXGRJbtqStPHRO0P4uFqVaVsZD',
})

Venue.destroy_all

venue = Venue.create!({
  name: 'Lighthouse',
  website: 'https://www.lighthouselabs.ca/?gclid=CjwKEAjw-abABRDquOTJi8qdojwSJABt1S1ONBGfRHFbKdKdEdWPwj6GkAMjhkXtv2qW3SbljLtAJBoCyBjw_wcB',
  description: 'A cool bar with cool people looking to sit back and cool.'
})

sport = Sport.create!({
  name: 'League of Legends'
})

Team.destroy_all

Team.create!({
  name: 'SKT'
})

Team.create!({
  name: 'H2K'
})

Event.destroy_all

venue.events.create!({
  name: 'Spring Split',
  sport: sport,
  team1_id: 1,
  team2_id: 2,
  event_datetime: DateTime.now
})

Review.destroy_all

Review.create!({
  venue: venue,
  user: user,
  description: 'Fantastic!',
  rating: 4
})

Review.create!({
  venue: venue,
  user: user,
  description: 'Not so good.',
  rating: 2
})

puts 'DONE!'
