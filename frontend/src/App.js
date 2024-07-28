import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
    Link,
} from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import Page404 from './pages/Page404';
import Chatroom from './pages/Chatroom';

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
                path: "/chatroom",
                element: <Chatroom />
            },
        ],
    },
]);

const App = () => {
    useEffect(() => {
        document.title = "RandomChat";
    }, []);
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;