defmodule Bomberman.Repo do
  use Ecto.Repo,
    otp_app: :bomberman,
    adapter: Ecto.Adapters.Postgres
end
