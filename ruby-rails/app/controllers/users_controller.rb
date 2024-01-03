class UsersController < ApplicationController
    skip_before_action :authorized, only: [:create]
    rescue_from ActiveRecord::RecordInvalid, with: :handle_invalid_record

    def create 
        user = User.create!(user_params)
        @token = encode_token(user_id: user.id)
        render json: {
            user: UserSerializer.new(user), 
            token: @token
        }, status: :created
    end

    def get 
        render json: current_user, status: :ok
    end

    def update
        user = User.new(user_params)
        current_user
        @user.update(user_params)
        render json: {
            user: UserSerializer.new(@user)
        }, status: :accepted
    end

    private

    def user_params 
        params.permit(:email, :password, :first_name, :last_name, :birthday, :city, :state, :zip)
    end

    def handle_invalid_record(e)
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

end
