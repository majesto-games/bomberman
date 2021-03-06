# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :bomberman,
  ecto_repos: [Bomberman.Repo]

# Configures the endpoint
config :bomberman, BombermanWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "XqblE6XOAG22434//R1qae8upi2SouTs6C0atBwzb2aPxbm6PQ44CPI7srXHTSPL",
  render_errors: [view: BombermanWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Bomberman.PubSub,
  check_origin: false,
  live_view: [signing_salt: "dFQjJVTA"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
