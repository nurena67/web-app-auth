import React, {useState, useEffect} from 'react';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Tidak ada token, Harap Login.!!');
                }
                const response = await axios.get("https://web-app-auth.up.railway.app/patients", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, withCredentials: true
                });
                setPatients(response.data);
            } catch (error) {
                console.error("Error get patients:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        getPatients();
    }, [navigate]);

    const goFormAdd = (FormAddPatient) =>{
        navigate('/patients/add')
    };
  
  return (
    <div>
        <div className="container mt-5 is-centered">
        <div className="row">
            <div className="col-md-8">
            <h1 className='title'> List Data Patients </h1>
            <div>
        <button onClick={goFormAdd}
        className="button is-lg is-primary" > Add Patient </button>
        </div>
                <table className="table is-striped is-fullwidth mt-3">
                    <thead style={{ backgroundColor: '#f0f8ff' }}>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Keluhan</th>
                            <th>Dokter Pemeriksa</th>
                            <th>Perawat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(patients) && patients.length > 0 ?(
                    patients.map(patient => (
                                <tr key={patient.medicalRecordNumber}>
                                    <td>{patient.medicalRecordNumber}</td>
                                    <td>{patient.name}</td>
                                    <td>{patient.complaint}</td>
                                    <td>{patient.doctorName}</td>
                                    <td>{patient.nurseNames.join(', ')}</td>
                                    <td>

                                    <Link to={`/patients/${patient.medicalRecordNumber}`} className='button is-small is-primary' > Detail </Link>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                No data available.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </div>
  )
}

export default PatientList