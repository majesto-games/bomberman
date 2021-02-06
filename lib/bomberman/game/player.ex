defmodule Bomberman.Player do
  @derive Jason.Encoder
  @type t :: %__MODULE__{
          id: String.t(),
          x: integer(),
          y: integer(),
          direction: String.t() | nil
        }
  @enforce_keys [:id, :x, :y]
  defstruct [:id, :x, :y, direction: nil]
end
