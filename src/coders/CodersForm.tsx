/* import React, { useState, useEffect } from 'react';
import { ICoder } from "@/models/coder/coder.model";

interface IFormProps {
  coder: ICoder | null; // Puede ser null cuando se está creando un nuevo coder
  onSubmit: (coder: ICoder) => Promise<void>; // Función que se llama en crear/editar
  onCancel: () => void; // Función para cancelar la edición
}

const initialForm: ICoder = {
  id: "",
  name: "",
  avatar: "",
  createdAt: new Date().toLocaleDateString('es-ES'),
};

const CreateForm: React.FC<IFormProps> = ({ coder, onSubmit, onCancel }) => {
  const [form, setForm] = useState<ICoder>(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (coder) {
      setForm(coder); // Cargar los datos del coder en el formulario al editar
    } else {
      setForm(initialForm); // Formulario vacío para creación
    }
  }, [coder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const newCoder: ICoder = {
      id: form.id, // Si tiene ID es una actualización, si no, será creación
      name: form.name,
      avatar: form.avatar,
      createdAt: form.createdAt || new Date().toLocaleDateString('es-ES'),
    };

    try {
      await onSubmit(newCoder);
      handleReset();
    } catch (error) {
      setError("Error al procesar el coder");
      console.error(error);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    onCancel(); // Cancelar la edición si es necesario
  };

  return (
    <main className="flex justify-center items-center p-4">
      <div className="bg-white rounded p-8 w-1/2">
        <h2 className="text-2xl text-center font-bold mb-4">{form.id ? 'Editar Coder' : 'Agregar Coder'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              placeholder="Escribe el nombre del coder"
              onChange={handleChange}
              value={form.name}
              required
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
              Avatar
            </label>
            <input
              type="text"
              name="avatar"
              placeholder="Escribe la URL del avatar"
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
              {form.id ? 'Actualizar' : 'Enviar'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateForm; */

"use client"

import React, { FormEvent, useState } from 'react';
import { ICoder } from "@/models/coder/coder.model";
import { CoderService } from '@/services/coders.service';
import { useRouter } from 'next/navigation';

const initialForm: ICoder = {
  id: "",
  name: "",
  avatar: "",
  createdAt: new Date().toLocaleDateString('es-ES'),
};

const CreateForm: React.FC = () => {
  const [form, setForm] = useState<ICoder>(initialForm);
  const [error, setError] = useState<string>("");

  const coderService = new CoderService();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const newCoder: ICoder = {
      ...form,
    };

    try {
      await coderService.create(newCoder);
      router.refresh(); 
      setForm(initialForm); 
    } catch (error) {
      setError("Error al crear el coder");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl text-center font-bold mb-4">Agregar Coder</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Escribe el nombre del coder"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
            Avatar
          </label>
          <input
            type="text"
            name="avatar"
            id="avatar"
            value={form.avatar}
            onChange={handleChange}
            required
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enlace del avatar"
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
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
