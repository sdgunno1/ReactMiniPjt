import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import DiaryList from "../components/DiaryList";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

const Home = () => {
    const diaryList = useContext(DiaryStateContext);
    const [data, setData] = useState([]);
    const [curDate, setCurDate] = useState(new Date());
    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}`;

    useEffect(() => {
        const firstDay = new Date(curDate.getFullYear(), curDate.getMonth(), 1);

        const lastDay = new Date(
            curDate.getFullYear(),
            curDate.getMonth() + 1,
            0,
            23,
            59,
            59
        );

        setData(
            diaryList.filter(
                (it) =>
                    firstDay <= new Date(it.date) &&
                    new Date(it.date) <= lastDay
            )
        );
    }, [diaryList, curDate]);

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `감정 일기장!`;
    }, []);

    const increaseMonth = () => {
        setCurDate(
            new Date(
                curDate.getFullYear(),
                curDate.getMonth() + 1,
                curDate.getDate()
            )
        );
    };

    const decreaseMonth = () => {
        setCurDate(
            new Date(
                curDate.getFullYear(),
                curDate.getMonth() - 1,
                curDate.getDate()
            )
        );
    };

    return (
        <div>
            <MyHeader
                headText={headText}
                leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
                rightChild={<MyButton text={">"} onClick={increaseMonth} />}
            />
            <DiaryList diaryList={data} />
        </div>
    );
};

export default Home;
