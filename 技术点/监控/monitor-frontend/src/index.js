import Performance from "./performance";
import Resource from "./resource";
import ErrorCatch from "./errorCatch";
import Behavior from "./behavior";

Performance.init((result) => {
  console.log(result);
});

Resource.init((result) => {
  console.log(result);
});

ErrorCatch.init((result) => {
  console.log(result);
});

Behavior.init((result) => {});
