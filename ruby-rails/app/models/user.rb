require "secureRandom"

class User < ApplicationRecord
    has_secure_password
    before_create :randomize_id
    validates :email, uniqueness: true, presence: true
    validates :password_digest, presence: true
    validates :first_name, presence: true
    validates :last_name, presence: true
    validates :birthday, presence: true
    validates :city, presence: true
    validates :state, presence: true
    validates :zip, presence: true

    private

    def randomize_id
        self.id = SecureRandom.uuid
    end
end
