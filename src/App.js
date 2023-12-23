import logo from './logo.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { useState, useEffect } from 'react';

// Composant principal
const App = () => {
    // État initial du composant
    const initialState = {
        prenom: '',
        nom: '',
        email: '',
        tel: '',
        listeUser: JSON.parse(localStorage.getItem('listeUser')) || [],
        isEditing: false,
        editingUserId: ''
    }

    // Utilisation du hook useState pour gérer l'état du composant
    const [state, setState] = useState(initialState)

    // useEffet pour mettre à jour le stockage local lorsque listeUser change
    useEffect(() => {
        localStorage.setItem('listeUser', JSON.stringify(state.listeUser));
    }, [state.listeUser])

    // Gérer le changement dans les champs de formulaire
    const handleChange = (name) => (e) => {
        setState(prevState => ({ ...prevState, [name]: e.target.value }));
    }

    // Ajouter un utilisateur
    const addUser = (e) => {
        e.preventDefault();
        if (state.prenom !== '' && state.nom !== '' && state.email !== '' && state.tel !== '') {
            let newUser
            if (state.isEditing) {
                // Modification d'un utilisateur existant
                newUser = state.listeUser.map(user =>
                    user.id === state.editingUserId ?
                        {
                            prenom: state.prenom,
                            nom: state.nom,
                            email: state.email,
                            tel: state.tel,
                            id: state.editingUserId 
                        }
                        : user
                )
            } else {
                // Ajout nouvel utilisateur
                newUser = {
                    id: Math.floor(Math.random() * 10000),
                    prenom: state.prenom,
                    nom: state.nom,
                    email: state.email,
                    tel: state.tel,
                    isEditing: false
                };
                newUser = [...state.listeUser, newUser]
            }
            // Mise à jour de l'état et stockage local
            setState(prevState => ({
                ...prevState,
                listeUser: newUser,
                prenom: '',
                nom: '',
                email: '',
                tel: '',
                isEditing: false
            }))
        } else {
            alert("Entrez d'abord tous les champs");
        }
    }

    // Modifier utilisateur
    const editUser = (userId) => {
        const user = state.listeUser.find(user => user.id === userId);
        // Mise à jour de l'état pour l'édition
        setState(prevState => ({
            ...prevState,
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            tel: user.tel,
            isEditing: true,
            editingUserId: userId
        }))
    }

    // Supprimer utilisateur
    const deleteUser = (userId) => {
        const newListeUser = state.listeUser.filter(user => user.id !== userId);
        // Mise à jour de l'état et stockage local
        setState(prevState => ({ ...prevState, listeUser: newListeUser }));
    }

    return (
        <div>
            <Form addUser={addUser} listeUser={state.listeUser} prenom={state.prenom} nom={state.nom} email={state.email} tel={state.tel} isEditing={state.isEditing} handleChange={handleChange} />

            <Table listeUser={state.listeUser} editUser={editUser} deleteUser={deleteUser} />
        </div>
    )
}

// Composant de formulaire
const Form = ({ addUser, listeUser, prenom, nom, email, tel, isEditing, handleChange }) => {

    const buttonClass = isEditing ? 'btn btn-warning' : 'btn btn-success';

    return (
        <div>
            <h2 className='text-center mt-3'>Jeemacoder gestion utilisateurs</h2>
            <form onSubmit={addUser} className='container w-50 shadow p-4'>
                <div className="row mt-3">
                    <Input label="Prenom" type="text" value={prenom} onChange={handleChange('prenom')} />
                    <Input label="Nom" type="text" value={nom} onChange={handleChange('nom')} />
                </div>
                <div className="row mt-3">
                    <Input label="Email" type="email" value={email} onChange={handleChange('email')} />
                    <Input label="Telephone" type="text" value={tel} onChange={handleChange('tel')} />
                </div>
                <button type="submit" className={`w-100 mt-4 ${buttonClass}`}>{isEditing ? 'Modifier' : 'Ajouter'}</button>
            </form>
        </div>
    )
}

// Composant input
const Input = ({ label, type, value, onChange }) => {

    return (
        <div className="col-12 col-md-6">
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} className='form-control mt-3' />
        </div>
    )
}

// Composant tableau
const Table = ({ listeUser, editUser, deleteUser }) => {
    
    return (
        <div>
            <h3 className='text-center my-4'>Utilisateurs</h3>
            <table className='table table-striped' style={{ width: '80%', margin: 'auto' }}>
                <thead>
                    <tr className='text-center'>
                        <th>Prenom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Telephone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <Tbody listeUser={listeUser} editUser={editUser} deleteUser={deleteUser} />
                </tbody>
            </table>
        </div>
    )
}

// Composant Tbody
const Tbody = ({ listeUser, editUser, deleteUser }) => {

    return (
        listeUser.map((user) => (
            <tr className='text-center' key={user.id}>
                <td>{user.prenom}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.tel}</td>
                <td>
                    <button className='btn btn-warning me-2' onClick={() => editUser(user.id)}>Modifier</button>
                    <button className='btn btn-danger ms-2 mt-2 mt-md-0' onClick={() => deleteUser(user.id)}>Supprimer</button>
                </td>
            </tr>
        ))
    )
}
export default App;