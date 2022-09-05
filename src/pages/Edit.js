import { useNavigate, useSearchParams } from "react-router-dom";

const Edit = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const mode = searchParams.get("mode");
    const who = searchParams.get("who");
    console.log(`id : ${id}`);
    console.log(`mode : ${mode}`);
    console.log(`who : ${who}`);

    return (
        <div>
            <h1>Edit</h1>
            <p>이곳은 수정페이지 입니다.</p>
            <button onClick={() => setSearchParams({ who: "sdgunno11" })}>
                QS 바꾸기
            </button>
            <button
                onClick={() => {
                    navigate("/home");
                }}
            >
                Home 이동
            </button>
            <button
                onClick={() => {
                    navigate(-1);
                }}
            >
                뒤로가기
            </button>
        </div>
    );
};

export default Edit;
