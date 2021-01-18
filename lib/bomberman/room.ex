defmodule Bomberman.Room do
  use GenServer
  alias Bomberman.Player
  alias BombermanWeb.RoomChannel

  @grid_size 20

  def start_link(default) when is_list(default) do
    GenServer.start_link(__MODULE__, default, name: __MODULE__)
  end

  @spec put_player(Player.t()) :: Player.t()
  def put_player(player) do
    GenServer.call(__MODULE__, {:put_player, player})
  end

  @spec get_player(integer) :: Player.t()
  def get_player(player_id) do
    GenServer.call(__MODULE__, {:get_player, player_id})
  end

  @spec remove_player(integer) :: [Player.t()]
  def remove_player(player_id) do
    GenServer.call(__MODULE__, {:remove_player, player_id})
  end

  @spec update_player(Player.t()) :: Player.t()
  def update_player(player) do
    GenServer.call(__MODULE__, {:update_player, player})
  end

  @spec get_players() :: [Player.t()]
  def get_players() do
    GenServer.call(__MODULE__, :get_players)
  end

  @spec move_player(integer, String.t()) :: Player.t()
  def move_player(player_id, direction) do
    # TODO: Move most code to inside the GenServer
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

  def place_bomb(player_id) do
    GenServer.call(__MODULE__, {:place_bomb, player_id})
  end

  def init(_arg) do
    {:ok, %{}}
  end

  def handle_call({:put_player, player}, _from, state) do
    {:reply, player, Map.put_new(state, player.id, player)}
  end

  def handle_call({:get_player, player_id}, _from, state) do
    {:reply, Map.get(state, player_id), state}
  end

  def handle_call({:remove_player, player_id}, _from, state) do
    new_state = Map.delete(state, player_id)
    {:reply, Map.values(new_state), new_state}
  end

  def handle_call({:update_player, player}, _from, state) do
    {:reply, player, Map.put(state, player.id, player)}
  end

  def handle_call(:get_players, _from, state) do
    {:reply, Map.values(state), state}
  end

  def handle_call({:place_bomb, player_id}, {pid, _}, state) do
    Map.get(state, player_id) |> start_bomb_timer(pid)
    {:reply, :ok, state}
  end

  def handle_info({:explode, x, y, pid}, state) do
    {players_dead, _players_alive} =
      state
      |> Map.values()
      |> Enum.split_with(fn player -> x == player.x && y == player.y end)

    RoomChannel.explode(pid, x, y, players_dead)

    player_alive_ids = Enum.map(players_dead, fn p -> p.id end)

    {:noreply, Map.drop(state, player_alive_ids)}
  end

  defp new_position(player, delta) do
    %Player{
      player
      | x: bounded_increment(player.x + delta.x),
        y: bounded_increment(player.y + delta.y)
    }
  end

  defp start_bomb_timer(%Player{x: x, y: y}, pid) do
    Process.send_after(self(), {:explode, x, y, pid}, 4000)
  end

  defp bounded_increment(value) when value < 0, do: 0
  defp bounded_increment(value) when value > @grid_size - 1, do: @grid_size - 1
  defp bounded_increment(value), do: value
end
