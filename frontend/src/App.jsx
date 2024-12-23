import { MantineProvider } from "@mantine/core";
import { theme } from "./configs/theme.configs";
import AppRouter from "./routers";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  );
}

export default App;
