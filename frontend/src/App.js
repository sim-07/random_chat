import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import Page404 from './pages/Page404';
import ChatRoom from './pages/ChatRoom';

const router = createBrowserRouter([
    {
        path: "/",
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
                path: "/ChatRoom",
                element: <ChatRoom />
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