import urls from "./urls.json"

function UserInput() {

    async function fetchAllData(e) {
        e.preventDefault();
        let data = await fetch(urls.v2.locations).then(res => res.json());
        console.log(data);
    }

    return (

        <div className="App">
            <input onClick={fetchAllData} type="button" value="View last report"></input>
        </div>
    );
}

export default UserInput;
