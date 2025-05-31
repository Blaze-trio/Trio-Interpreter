Class cat < ActiveRecord::Base
Validates :pet_name, length:{maximum:30}
end