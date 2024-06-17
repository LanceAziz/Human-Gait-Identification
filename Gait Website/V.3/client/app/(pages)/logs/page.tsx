'use client';
import { useEffect, useState } from 'react';
import styles from "./Logs.module.css"

type Prediction = {
    name: string;
    date: string;
};

function Logs() {
    const getAPI = 'http://localhost:8080/get/predictions';
    const [usersData, setUsersData] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await fetch(getAPI);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setUsersData(data.predictions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                setLoading(false); // Ensure loading state is false even if there's an error
            }
        };

        fetchPredictions();
    }, []);

    const dateFormatter = (dateTime: string) => {
        const date = new Date(dateTime);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }
    const timeFormatter = (dateTime: string) => {
        const date = new Date(dateTime);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const isPM = hours >= 12;
        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    };

    return (
        <div className="container px-5">
            <div className="row">
                <h2 className="text-center pt-4 pb-2">Logs</h2>
                <input type="text" placeholder='Saech Name' className={`rounded rounded-5 form-control my-3 ${styles.gaitBoxShadow} `} onChange={(e) => setSearch(e.target.value)} disabled={loading} />
                {loading ? (
                    <button className='hourglassBackground'>
                        <div className='hourglassContainer'>
                            <div className='hourglassCurves'></div>
                            <div className='hourglassCapTop'></div>
                            <div className='hourglassGlassTop'></div>
                            <div className='hourglassSand'></div>
                            <div className='hourglassSandStream'></div>
                            <div className='hourglassCapBottom'></div>
                            <div className='hourglassGlass'></div>
                        </div>
                    </button>
                ) : usersData.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center fs-1 pt-5">Logs are empty</div>
                ) : (
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
                            {usersData.filter((user)=>(
                                search.toLowerCase() === '' ? user : user.name.toLowerCase().includes(search)
                            )).map((user, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{timeFormatter(user.date)}</td>
                                    <td>{dateFormatter(user.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Logs;
