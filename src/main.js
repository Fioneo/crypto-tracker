import "./styles/global.css";
import Navigation from "./scripts/Navigation.js";
new Navigation({
  topLinkId: "topLink",
  dashLinkId: "dashLink",
  logoLinkId: "logoLink",
  backButtonSelector: ".backButton",
  topContainerId: "topContainer",
  dashContainerId: "dashContainer",
  coinsContainerId: "coinContainer",
  coinsTopId: ".coinTopList",
});
