defmodule Bomberman.Room do
  use Agent
  alias Bomberman.Player

  @grid_size 20

  def start_link(_args \\ []) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  @spec put_player(Player.t()) :: Player.t()
  def put_player(player) do
    Agent.update(__MODULE__, &Map.put_new(&1, player.id, player))
    player
  end

  @spec get_player(integer) :: Player.t()
  def get_player(player_id) do
    Agent.get(__MODULE__, &Map.get(&1, player_id))
  end

  @spec remove_player(integer) :: [Player.t()]
  def remove_player(player_id) do
    Agent.get(__MODULE__, &Map.values(Map.delete(&1, player_id)))
  end

  @spec update_player(Player.t()) :: Player.t()
  def update_player(player) do
    Agent.update(__MODULE__, &Map.put(&1, player.id, player))
    player
  end

  @spec get_players() :: [Player.t()]
  def get_players() do
    Agent.get(__MODULE__, &Map.values(&1))
  end

  @spec move_player(integer, String.t()) :: Player.t()
  def move_player(player_id, direction) do
    delta =
      case direction do
        "right" -> %{x: 1, y: 0}
        "left" -> %{x: -1, y: 0}
        "up" -> %{x: 0, y: -1}
        "down" -> %{x: 0, y: 1}
      end

    player_id
    |> get_player()
    |> new_position(delta)
    |> update_player()
  end

  defp new_position(player, delta) do
    %Player{
      player
      | x: bounded_increment(player.x + delta.x),
        y: bounded_increment(player.y + delta.y)
    }
  end

  defp bounded_increment(value) when value < 0, do: 0
  defp bounded_increment(value) when value > @grid_size - 1, do: @grid_size - 1
  defp bounded_increment(value), do: value
end
