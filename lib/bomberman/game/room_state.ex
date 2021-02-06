defmodule Bomberman.RoomState do
  alias Bomberman.{Player, RoomMap, Position}

  @derive Jason.Encoder
  @type t :: %__MODULE__{
          players: %{String.t() => %Player{}},
          map: %RoomMap{},
          bombs: [%Position{}]
        }
  @enforce_keys []
  defstruct players: %{}, map: %RoomMap{}, bombs: []
end
