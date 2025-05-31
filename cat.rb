Class cat < ActiveRecord::Base
validates :pet_name, length:{maximum:60}
end