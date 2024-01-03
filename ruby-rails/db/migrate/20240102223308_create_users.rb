class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :blob do |t|
      t.string :email
      t.string :password_digest
      t.string :first_name
      t.string :last_name
      t.string :birthday
      t.string :city
      t.string :state
      t.string :zip
      t.timestamps
    end
  end
end
