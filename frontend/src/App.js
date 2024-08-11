import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import Page404 from './pages/Page404';
import ChatRoom from './pages/ChatRoom';
import { SocketProvider } from './Socket';

const router = createBrowserRouter([
    {
        path: "/",
        //element: <Root />,
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
                element: <ChatRoom/>
            },
        ],
    },
]);

const App = () => {
    useEffect(() => {
        document.title = "RandomChat";
    }, []);
    return (
        <SocketProvider>
            <RouterProvider router={router} />
        </SocketProvider>
        
    );
};

export default App;