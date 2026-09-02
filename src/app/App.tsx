import { Route, Switch } from "react-router-dom";
import { EquipmentPassportPage } from "../pages/EquipmentDetailPage";
import { ArdhiPassportPage } from "../pages/ArdhiPassportPage";
import { GolfCartTechBuildPage } from "../pages/GolfCartTechBuildPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PowerControlModulePage } from "../pages/PowerControlModulePage";
import { CatalogPage } from "../pages/CatalogPage";

export function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/index.html" component={HomePage} />
      <Route exact path="/sp-ardhi-26.html" component={ArdhiPassportPage} />
      <Route exact path="/sp-mzigo-26.html" render={() => <EquipmentPassportPage slug="sp-mzigo-26" />} />
      <Route exact path="/golf-cart-tech-build.html" component={GolfCartTechBuildPage} />
      <Route exact path="/catalog" component={CatalogPage} />
      <Route exact path="/catalog/" component={CatalogPage} />
      <Route exact path="/catalog/sp-pcm-001" component={PowerControlModulePage} />
      <Route exact path="/catalog/sp-pcm-001/" component={PowerControlModulePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
