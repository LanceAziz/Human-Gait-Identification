import styles from "./Logs.module.css"

function Logs() {
    const usersData = [
        { id: 1, name: 'Lance', time: '7:00 AM', date: '25/6/2024' },
        { id: 2, name: 'Seif', time: '8:00 AM', date: '25/6/2024' },
        { id: 3, name: 'Mina', time: '9:00 AM', date: '25/6/2024' },
        { id: 4, name: 'Omar', time: '10:00 AM', date: '25/6/2024' }
    ]
    return (
        <>
            <div className="container px-5">
                <div className="row">
                    <h2 className="text-center pt-4 pb-2">Logs</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Time</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => {
                                return (
                                    <tr>
                                        <th scope="row">{user.id}</th>
                                        <td>{user.name}</td>
                                        <td>{user.time}</td>
                                        <td>{user.date}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default Logs