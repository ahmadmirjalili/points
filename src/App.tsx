import Map from "src/components/Map";
import ControlMapButton from "src/components/ControlMapButton";
import SnakeBar from "src/templates/SnakeBar";
import MenuDrawer from "src/components/MenuDrawer";

function App() {
  return (
    <>
      <Map />
      <ControlMapButton />
      <MenuDrawer />
      <SnakeBar />
    </>
  );
}

export default App;
