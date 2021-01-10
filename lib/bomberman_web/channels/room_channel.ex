defmodule BombermanWeb.RoomChannel do
  use Phoenix.Channel
  alias Bomberman.Room

  def join("room:lobby", _message, socket) do
    new_room = Room.join(socket.assigns.username)

    broadcast!(socket, "joined", Map.values(new_room))

    {:ok,
     %{
       username: socket.assigns.username
     }, socket}
  end

  def handle_in("move", %{"direction" => direction}, socket) do
    new_user = Room.move(socket.assigns.username, direction)
    broadcast!(socket, "moved", new_user)
    {:noreply, socket}
  end
end
