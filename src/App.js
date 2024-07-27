import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
    Link,
} from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Page404 from './pages/Page404';

const router = createBrowserRouter([
    {
        path: "/",
        /*element: <Root />,*/
        errorElement: <Page404 />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/about",
                element: <About />
            },
        ],
    },
]);

const App = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;