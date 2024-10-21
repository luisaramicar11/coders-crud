"use client"
import React, {useState} from 'react';
import { ICoder } from '@/models/coder/coder.model';
import { CoderService } from '@/services/coders.service';
import { useRouter } from 'next/navigation';
import CreateForm from "./CodersForm";


interface IProps{
    data: ICoder[]
}
export default function CodersTable({data}: IProps) {
  const [coders, setCoders] = useState<ICoder[]>(data);
  const [ editingId, setEditingId] = useState<string | null>(null); 
  const [ formData, setFormData] = useState<ICoder>({id: "",
    name: "",
    avatar: "",
    createdAt: new Date().toLocaleDateString('es-ES'),});

  const useCoderService = new CoderService()
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await useCoderService.destroy(id)
    router.refresh();
  } 

  const handleEdit = (coder: ICoder ) => {
    setEditingId(coder.id as string);
    setFormData({name: coder.name, avatar: coder.avatar});
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target;
    setFormData(prevState => ({...prevState, [name]: value}));
  }

  const handleUpdate = async () => {
    if (editingId) {
        try {
            const updatedCoder: ICoder = {
                id: editingId, // Usa el editingId para el ID
                name: formData.name || "", // Proporciona un valor por defecto
                avatar: formData.avatar || "", // Proporciona un valor por defecto
                createdAt: new Date().toLocaleDateString('es-ES'), // O mantén el valor existente si es necesario
            };

            // Usa editingId en lugar de id aquí
            const result= await useCoderService.update(editingId, updatedCoder);
            setCoders(coders.map(coder => (coder.id === editingId ? result : coder)));
            setEditingId(null);
        } catch (error) {
            console.log("Error al actualizar:", error);
        }
    }
};

  return (
    <div>
        <h1>Coders</h1>
        <CreateForm/>
        <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Avatar</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((coder: ICoder) => (
          <tr key={coder.id}>
            <td>{editingId === coder.id ? (
                <input
                    type="text"
                    name="name"
                    placeholder="Escribe el nombre del coder"
                    onChange={handleChange}
                    value={formData.name}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />): (coder.name)}</td>
            <td>{editingId === coder.id ? (
                <input
                    type="text"
                    name="avatar"
                    placeholder="Escribe la imagen del coder"
                    onChange={handleChange}
                    value={formData.avatar}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />): (coder.avatar)}</td>
            <td>
            {editingId === coder.id ? (
                                    <>
                                        <button onClick={() => handleUpdate(coder.id)}>Guardar</button>
                                        <button onClick={() => setEditingId(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleDelete(coder.id)}>Borrar</button>
                                        <button onClick={() => handleEdit(coder)}>Actualizar</button>
                                    </>
                                )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
  )
}
