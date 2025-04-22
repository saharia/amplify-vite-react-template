// ButtonWithIcon.tsx
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material"; // Adjust the import path if necessary

export function Buttons() {
  const navigate = useNavigate();

  return {
    CreateButton: ({ route }: { route: string }) => (
      <Button
        onClick={() => navigate(route)}
        variant="contained"
        color="primary"
        startIcon={<Plus size={18} />}
      >
        Create
      </Button>
    ),
    EditButton: () => (
      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
        <Edit3 size={18} />
        Edit
      </button>
    ),
    DeleteButton: () => (
      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        <Trash2 size={18} />
        Delete
      </button>
    ),
  };
}
