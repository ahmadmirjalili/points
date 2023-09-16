import Map from "src/components/Map";
import ControlMapButton from "src/components/ControlMapButton";
import SnakeBar from "src/templates/SnakeBar";
import MenuDrawer from "src/components/MenuDrawer";
import WelcomeModal from "src/components/WelcomeModal";

function App() {
  return (
    <>
      <Map />
      <ControlMapButton />
      <MenuDrawer />
      <SnakeBar />
      <WelcomeModal />
    </>
  );
}

export default App;
