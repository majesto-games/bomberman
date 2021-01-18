defmodule BombermanWeb.RoomChannel do
  use Phoenix.Channel
  alias Bomberman.Room
  alias Bomberman.Player

  def join("room:lobby", _message, socket) do
    send(self(), :after_join)

    {:ok,
     %{
       id: socket.assigns.username,
       players: Room.get_players()
     }, socket}
  end

  def terminate(_reason, socket) do
    player_id = socket.assigns.username
    Room.remove_player(socket.assigns.username)
    broadcast!(socket, "left", %{player_id: player_id})
  end

  def handle_in("move", %{"direction" => direction}, socket) do
    new_user = Room.move_player(socket.assigns.username, direction)
    broadcast!(socket, "moved", new_user)
    {:noreply, socket}
  end

  def handle_in("bomb", _message, socket) do
    player = Room.get_player(socket.assigns.username)
    Room.place_bomb(player.id)
    broadcast!(socket, "bomb", %{x: player.x, y: player.y})
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    player = Room.put_player(%Player{id: socket.assigns.username, x: 0, y: 0})
    broadcast!(socket, "joined", %{player: player})
    {:noreply, socket}
  end

  def handle_info({:explode, x, y, players_dead}, socket) do
    broadcast!(socket, "explosion", %{x: x, y: y, players_dead: players_dead})
    {:noreply, socket}
  end

  def explode(pid, x, y, players_dead) do
    send(pid, {:explode, x, y, players_dead})
  end
end
