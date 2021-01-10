defmodule BombermanWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    {:ok, socket.assigns.username, socket}
  end
end
