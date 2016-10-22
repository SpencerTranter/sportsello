class Event < ActiveRecord::Base


  has_many :can_hosts
  has_many :venues, through: :can_hosts
  belongs_to :sport

  validates :name, presence: true
  validates :event_datetime, presence: true
  validates :team1_id, numericality: { only_integer: true }
  validates :team2_id, numericality: { only_integer: true }


private

def event_datetime_is_date?
   if !event_datetime.is_a?(DateTime)
    puts(:event_datetime)
     errors.add(:event_datetime, 'must be a valid date')
   end
end

end
