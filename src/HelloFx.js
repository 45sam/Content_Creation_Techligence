import React from "react";
import { Mafs, Coordinates, Plot} from "mafs";

function HelloFx() {
  return (
    <Mafs>
      <Coordinates.Cartesian subdivisions={4}/>
      <Plot.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  );
}

export default HelloFx;
