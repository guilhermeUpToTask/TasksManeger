import { useState } from "react";
import "./App.css";
import React from "react";
import Layout from "./routes/_layout";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Layout />
        </>
    );
}

export default App;
