defmodule Bomberman.Position do
  @derive Jason.Encoder
  @type t :: %__MODULE__{
          x: integer(),
          y: integer()
        }
  @enforce_keys [:x, :y]
  defstruct [:x, :y]
end
