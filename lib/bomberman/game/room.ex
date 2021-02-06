defmodule Bomberman.Room do
  use GenServer
  alias Bomberman.{RoomState, RoomMap, Position, Player}
  alias BombermanWeb.RoomChannel

  @tick_rate 10

  def start_link(default) when is_list(default) do
    GenServer.start_link(__MODULE__, default, name: __MODULE__)
  end

  @spec put_player(integer()) :: Player.t()
  def put_player(player_id) do
    GenServer.call(__MODULE__, {:put_player, player_id})
  end

  @spec get_player(integer()) :: Player.t()
  def get_player(player_id) do
    GenServer.call(__MODULE__, {:get_player, player_id})
  end

  @spec remove_player(integer()) :: [Player.t()]
  def remove_player(player_id) do
    GenServer.call(__MODULE__, {:remove_player, player_id})
  end

  @spec update_player(Player.t()) :: Player.t()
  def update_player(player) do
    GenServer.call(__MODULE__, {:update_player, player})
  end

  @spec get_state() :: %RoomState{}
  def get_state() do
    GenServer.call(__MODULE__, :get_state)
  end

  @spec change_direction(integer, String.t()) :: any()
  def change_direction(player_id, direction) do
    GenServer.call(__MODULE__, {:change_direction, player_id, direction})
  end

  def place_bomb(player_id) do
    GenServer.call(__MODULE__, {:place_bomb, player_id})
  end

  # Server code below

  def init(_arg) do
    :timer.send_interval(div(1000, @tick_rate), :tick)
    {:ok, %RoomState{}}
  end

  def handle_call({:put_player, player_id}, _from, %RoomState{} = state) do
    player_count = length(Map.values(state.players))
    spawn_point = RoomMap.spawn_points(state.map) |> Enum.at(player_count)
    player = %Player{id: player_id, position: spawn_point}
    {:reply, player, %RoomState{state | players: Map.put_new(state.players, player_id, player)}}
  end

  def handle_call({:get_player, player_id}, _from, %RoomState{} = state) do
    {:reply, Map.get(state.players, player_id), state}
  end

  def handle_call({:remove_player, player_id}, _from, %RoomState{} = state) do
    players = Map.delete(state.players, player_id)
    {:reply, Map.values(players), %RoomState{state | players: players}}
  end

  def handle_call({:update_player, player}, _from, %RoomState{} = state) do
    {:reply, player, %RoomState{state | players: Map.put(state.players, player.id, player)}}
  end

  def handle_call(:get_state, _from, %RoomState{} = state) do
    {:reply, state, state}
  end

  def handle_call({:change_direction, player_id, direction}, _from, %RoomState{} = state) do
    player = %Player{
      Map.get(state.players, player_id)
      | direction: direction
    }

    {:reply, :ok, %RoomState{state | players: Map.put(state.players, player.id, player)}}
  end

  def handle_call({:place_bomb, player_id}, _from, %RoomState{} = state) do
    Map.get(state.players, player_id) |> start_bomb_timer
    {:reply, :ok, state}
  end

  def handle_info({:explode, x, y}, %RoomState{} = state) do
    {players_dead, _players_alive} =
      state.players
      |> Map.values()
      |> Enum.split_with(fn player -> x == player.x && y == player.y end)

    RoomChannel.explode(x, y, players_dead)

    player_alive_ids = Enum.map(players_dead, fn p -> p.id end)

    {:noreply, %RoomState{state | players: Map.drop(state, player_alive_ids)}}
  end

  def handle_info(:tick, state) do
    players =
      for {player_id, player} <- state.players,
          into: %{},
          do: {player_id, update_player_position(player, state)}

    new_state = %RoomState{state | players: players}

    RoomChannel.tick(new_state.players)

    {:noreply, new_state}
  end

  defp update_player_position(%Player{direction: nil} = player, _state), do: player

  defp update_player_position(%Player{} = player, %RoomState{} = state) do
    delta =
      case player.direction do
        "right" -> %Position{x: 1, y: 0}
        "left" -> %Position{x: -1, y: 0}
        "up" -> %Position{x: 0, y: -1}
        "down" -> %Position{x: 0, y: 1}
      end

    new_x = min(max(0, player.position.x + delta.x), RoomMap.width(state.map) - 1)
    new_y = min(max(0, player.position.y + delta.y), RoomMap.height(state.map) - 1)

    unless RoomMap.at(state.map, new_x, new_y) > 1 do
      %Player{player | position: %Position{x: new_x, y: new_y}, direction: nil}
    else
      %Player{player | direction: nil}
    end
  end

  defp start_bomb_timer(%Player{position: %Position{x: x, y: y}}) do
    Process.send_after(self(), {:explode, x, y}, 4000)
  end
end
