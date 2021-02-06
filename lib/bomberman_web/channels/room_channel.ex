defmodule BombermanWeb.RoomChannel do
  use Phoenix.Channel, log_join: :info, log_handle_in: false
  alias Bomberman.Room

  @topic "room:lobby"

  def join(@topic, _message, socket) do
    send(self(), :after_join)

    {:ok, %{id: socket.assigns.username, state: Room.get_state()}, socket}
  end

  def terminate(_reason, socket) do
    player_id = socket.assigns.username
    Room.remove_player(socket.assigns.username)
    broadcast!(socket, "left", %{player_id: player_id})
  end

  def handle_in("move", %{"direction" => direction}, socket) do
    Room.change_direction(socket.assigns.username, direction)
    {:noreply, socket}
  end

  def handle_in("bomb", _message, socket) do
    player = Room.get_player(socket.assigns.username)
    Room.place_bomb(player.id)
    broadcast!(socket, "bomb", %{x: player.x, y: player.y})
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    player = Room.put_player(socket.assigns.username)
    broadcast!(socket, "joined", %{player: player})
    {:noreply, socket}
  end

  def handle_info({:explode, x, y, players_dead}, socket) do
    broadcast!(socket, "explosion", %{x: x, y: y, players_dead: players_dead})
    {:noreply, socket}
  end

  def explode(x, y, players_dead) do
    BombermanWeb.Endpoint.broadcast(@topic, "explosion", %{x: x, y: y, players_dead: players_dead})
  end

  def tick(players) do
    BombermanWeb.Endpoint.broadcast(@topic, "tick", %{players: players})
  end
end
