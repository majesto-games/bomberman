defmodule Bomberman.RoomMap do
  alias Bomberman.Position

  @derive Jason.Encoder
  @type t :: %__MODULE__{
          blocks: [[integer()]]
        }
  @enforce_keys []

  @spec width(%__MODULE__{}) :: non_neg_integer()
  def width(map), do: length(Enum.at(map.blocks, 0, []))

  @spec height(%__MODULE__{}) :: non_neg_integer()
  def height(map), do: length(map.blocks)

  @spec at(%__MODULE__{}, non_neg_integer(), non_neg_integer()) :: non_neg_integer()
  def at(map, x, y), do: Enum.at(Enum.at(map.blocks, y), x)

  @spec spawn_points(%__MODULE__{}) :: [%Position{}]
  def spawn_points(map) do
    for {columns, x} <- Enum.with_index(map.blocks),
        {block, y} <- Enum.with_index(columns),
        block == 1,
        do: %Position{x: x, y: y}
  end

  defstruct blocks: [
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
            ]
end
