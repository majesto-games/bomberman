defmodule Bomberman.Player do
  alias Bomberman.Position

  @derive Jason.Encoder
  @type t :: %__MODULE__{
          id: String.t(),
          position: Position.t(),
          direction: String.t() | nil
        }
  @enforce_keys [:id]
  defstruct [:id, :position, direction: nil]
end
