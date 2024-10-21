import React, { FormEvent, MouseEvent, useState } from 'react';
import { ICoder } from "../models/coder/coder.model";
import { CoderService } from '@/services/coders.service';
import { useRouter } from "next/navigation"

const initialForm: ICoder = {
    id: "",
    name: "",
    avatar: "",
    createdAt: new Date().toLocaleDateString('es-ES'),
};

const CreateForm: React.FC = () => {
    const [form, setForm] = useState<ICoder>(initialForm);
    const [ error, setError] = useState("")
    const coderService = new CoderService();
    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const newCoder: ICoder = {
            id: "",
            name: form.name,
            avatar: form.avatar,
            createdAt: form.createdAt,
        }

        try {
            await coderService.create(newCoder)
            router.refresh()
            handleReset(e);
        } catch (error) {
            setError("Error al crear el coder")
            console.error(error);
        }
    };

    const handleReset = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setForm(initialForm);
    };


    return (
        <main className="flex justify-center items-center p-4">
    <div className="bg-white rounded p-8 w-1/2">
        <h2 className="text-2xl text-center font-bold mb-4">Agregar Coder</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nombre
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Escribe el nombre de la tarea"
                    onChange={handleChange}
                    value={form.name}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Avatar
                </label>
                <input
                    type="text"
                    name="avatar"
                    placeholder="Escribe la descripción de la tarea"
                    onChange={handleChange}
                    value={form.avatar}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-between">
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Enviar
                </button>
                <button 
                    type="button" 
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Limpiar
                </button>
            </div>
        </form>
    </div>
</main>

    );
};

export default CreateForm;