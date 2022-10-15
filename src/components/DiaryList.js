import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import MyButton from "./MyButton";

const sortOptionList = [
    { value: "lastest", name: "최신순" },
    { value: "oldest", name: "오래된 순" },
];

const filterOptionList = [
    { value: "all", name: "전부다" },
    { value: "good", name: "좋은 감정" },
    { value: "bad", name: "나쁜 감정" },
];

const ControlMenu = React.memo(({ value, onChange, optionList }) => {
    return (
        <select
            className="ControlMenu"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {optionList.map((it, idx) => (
                <option key={idx} value={it.value}>
                    {it.name}
                </option>
            ))}
        </select>
    );
});

const DiaryList = ({ diaryList }) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState("lastest");
    const [filter, setFileter] = useState("all");

    const getProccessedDiaryList = () => {
        const filterCallback = (it) => {
            if (filter === "good") {
                return parseInt(it.emotion) <= 3;
            } else {
                return parseInt(it.emotion) > 3;
            }
        };

        const compare = (a, b) => {
            if (sortType === "lastest") {
                return new Date(b.date) - new Date(a.date);
            } else {
                return new Date(a.date) - new Date(b.date);
            }
        };

        const copyList = JSON.parse(JSON.stringify(diaryList));
        const filteredList =
            filter === "all"
                ? copyList
                : copyList.filter((it) => filterCallback(it));
        return filteredList.sort(compare);
    };

    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <ControlMenu
                        value={sortType}
                        onChange={setSortType}
                        optionList={sortOptionList}
                    />
                    <ControlMenu
                        value={filter}
                        onChange={setFileter}
                        optionList={filterOptionList}
                    />
                </div>
                <div className="right_col">
                    <MyButton
                        text={"새 일기쓰기"}
                        type={"positive"}
                        onClick={() => navigate("/new")}
                    />
                </div>
            </div>

            {getProccessedDiaryList().map((it) => (
                <DiaryItem key={it.id} {...it} />
            ))}
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
