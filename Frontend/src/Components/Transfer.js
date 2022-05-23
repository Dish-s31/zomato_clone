import { BrowserRouter, Route } from "react-router-dom";

import Home from './Home';
import Filter from './Filter';
import Details from "./Details";
import Header from "./Header";

// router to route on different components

function Router() {
    return (
        <BrowserRouter>
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/filter" component={Filter} />
            <Route exact path="/details" component={Details} />

        </BrowserRouter>
    )
}
export default Router;