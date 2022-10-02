import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import { getStringDate } from "./util/date.js";

const reducer = (state, action) => {
    let newState = [];
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            newState = [action.data, ...state];
            break;
        }
        case "REMOVE": {
            newState = state.filter((it) => it.id !== action.targetId);
            break;
        }
        case "EDIT": {
            newState = state.map((it) =>
                it.id === action.data.id ? { ...action.data } : it
            );
            break;
        }
        default:
            return state;
    }

    //localStorage.setItem("diary", JSON.stringify(newState));
    return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
    const [data, dispatch] = useReducer(reducer, []);
    const dataId = useRef(1);

    // useEffect(() => {
    //     const localData = localStorage.getItem("diary");
    //     if (localData) {
    //         const diaryList = JSON.parse(localData).sort(
    //             (a, b) => parseInt(b.id) - parseInt(a.id)
    //         );

    //         if (diaryList.length >= 1) {
    //             dataId.current = parseInt(diaryList[0].id) + 1;
    //             dispatch({ type: "INIT", data: diaryList });
    //         }
    //     }
    // }, []);

    useEffect(() => {
        fetch("/api/v1/diarys")
            .then((res) => res.json())
            .then((diaryList) => {
                if (diaryList) {
                    diaryList.sort((a, b) => b.id - a.id);
                    if (diaryList.length >= 1) {
                        dataId.current = parseInt(diaryList[0].id) + 1;
                        dispatch({ type: "INIT", data: diaryList });
                    }
                }
            });
    }, []);

    //Create
    const onCreate = (date, content, emotion) => {
        const postData = {
            id: dataId.current,
            date: getStringDate(new Date(date)),
            content,
            emotion,
        };
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        };
        fetch("/api/v1/diarys", requestOptions)
            .then((res) => res.json())
            .then((resData) => {
                dispatch({
                    type: "CREATE",
                    data: resData,
                });
                dataId.current += 1;
            });
    };

    //Remove
    const onRemove = (targetId) => {
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(targetId),
        };
        fetch(`/api/v1/diarys/${targetId}`, requestOptions)
            .then((res) => res.json())
            .then((resData) => {
                dispatch({ type: "REMOVE", targetId });
            });
    };

    //Edit
    const onEdit = (targetId, date, content, emotion) => {
        const putData = {
            id: targetId,
            date: getStringDate(new Date(date)),
            content,
            emotion,
        };
        const requestOption = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(putData),
        };
        fetch(`/api/v1/diarys/${targetId}`, requestOption)
            .then((res) => res.json())
            .then((resData) => {
                dispatch({
                    type: "EDIT",
                    data: resData,
                });
            });
    };

    return (
        <DiaryStateContext.Provider value={data}>
            <DiaryDispatchContext.Provider
                value={{ onCreate, onEdit, onRemove }}
            >
                <BrowserRouter>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/new" element={<New />} />
                            <Route path="/edit/:id" element={<Edit />} />
                            <Route path="/diary/:id" element={<Diary />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
    );
}

export default App;
