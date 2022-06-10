import "./polyfills";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";


const App = React.lazy(() => import("./App"));

ReactDOM.render(
  <React.Fragment>
    <Suspense fallback={<div style={{marginLeft:"45%",marginTop:"25%"}}>HanelApp yüklenirken bekleyin ...</div>}>
      <App />
    </Suspense>
  </React.Fragment>,
  document.getElementById("root")
);


serviceWorkerRegistration.register();

reportWebVitals();