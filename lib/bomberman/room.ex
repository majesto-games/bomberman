defmodule Bomberman.Room do
  use Agent

  def start_link(_args \\ []) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def join(username) do
    Agent.get_and_update(
      __MODULE__,
      fn state ->
        new_state = Map.put_new(state, username, %{x: 10, y: 20, username: username})
        {new_state, new_state}
      end
    )
  end

  def move(username, direction) do
    Agent.get_and_update(
      __MODULE__,
      fn state ->
        Map.get_and_update!(
          state,
          username,
          fn user ->
            case direction do
              "up" ->
                new_user = Map.update!(user, :y, fn y -> y - 3 end)
                {new_user, new_user}

              "down" ->
                new_user = Map.update!(user, :y, fn y -> y + 3 end)
                {new_user, new_user}

              "left" ->
                new_user = Map.update!(user, :x, fn x -> x - 3 end)
                {new_user, new_user}

              "right" ->
                new_user = Map.update!(user, :x, fn x -> x + 3 end)
                {new_user, new_user}
            end
          end
        )
      end
    )
  end
end
