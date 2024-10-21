/* "use client";

import React, { useState } from 'react';
import { ICoder } from '@/models/coder/coder.model';
import { CoderService } from '@/services/coders.service';
import { useRouter } from 'next/navigation';
import CreateForm from './CodersForm';

interface IProps {
  data: ICoder[];
}

export default function CodersTable({ data }: IProps) {
  const [coders, setCoders] = useState<ICoder[]>(data);
  const [selectedCoder, setSelectedCoder] = useState<ICoder | null>(null); // Modo creación o edición
  const useCoderService = new CoderService();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await useCoderService.destroy(id);
    setCoders(coders.filter(coder => coder.id !== id)); // Actualizar lista
    router.refresh();
  };

  const handleEdit = (coder: ICoder) => {
    setSelectedCoder(coder); // Pasamos el coder a editar al formulario
  };

  const handleFormSubmit = async (coder: ICoder) => {
    if (coder.id) {
      // Modo edición
      const updatedCoder = await useCoderService.update(coder.id, coder);
      setCoders(coders.map(c => (c.id === coder.id ? updatedCoder : c)));
    } else {
      // Modo creación
      const newCoder = await useCoderService.create(coder);
      setCoders(prevCoders => [...prevCoders, newCoder]);
    }

    setSelectedCoder(null); // Limpiamos el formulario
    router.refresh();
  };

  return (
    <div>
      <h1>Coders</h1>
      <CreateForm coder={selectedCoder} onSubmit={handleFormSubmit} onCancel={() => setSelectedCoder(null)} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Avatar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {coders.map((coder: ICoder) => (
            <tr key={coder.id}>
              <td>{coder.id}</td>
              <td>{coder.name}</td>
              <td>{coder.avatar}</td>
              <td>
                <button onClick={() => handleDelete(coder.id as string)}>Borrar</button>
                <button onClick={() => handleEdit(coder)}>Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} */

"use client";

import React, { useState } from 'react';
import { ICoder } from '@/models/coder/coder.model';
import { CoderService } from '@/services/coders.service';
import { useRouter } from 'next/navigation';

interface IProps {
  data: ICoder[];
}

export default function CodersTable({ data }: IProps) {
  const [coders, setCoders] = useState<ICoder[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ICoder>({
    id: "",
    name: "",
    avatar: "",
    createdAt: new Date().toLocaleDateString('es-ES'),
  });
  
  const useCoderService = new CoderService();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await useCoderService.destroy(id);
    setCoders(coders.filter(coder => coder.id !== id));
    router.refresh();
  };

  const handleEdit = (coder: ICoder) => {
    setEditingId(coder.id as string);
    setFormData({ ...coder });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async () => {
    if (editingId) {
      try {
        const updatedCoder = await useCoderService.update(editingId, formData);
        setCoders(coders.map(coder => (coder.id === editingId ? updatedCoder : coder)));
        setEditingId(null);
      } catch (error) {
        console.log("Error al actualizar:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Coders</h1>
      
      <table className="table-auto w-full mt-8">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coders.map((coder: ICoder) => (
            <tr key={coder.id}>
              <td className="border px-4 py-2">{coder.id}</td>
              <td className="border px-4 py-2">
                {editingId === coder.id ? (
                  <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Escribe el nombre del coder"
                  />
                </div>
                ) : (
                  coder.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === coder.id ? (
                  <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                    Avatar
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    id="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enlace del avatar"
                  />
                </div>
                ) : (
                  <img src={coder.avatar} alt={coder.name} className="w-10 h-10 rounded-full" />
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === coder.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(coder)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(coder.id as string)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
