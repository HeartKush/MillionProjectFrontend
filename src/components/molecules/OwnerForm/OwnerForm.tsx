import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/atoms";
import type { CreateOwnerRequest, OwnerDetail } from "@/lib/types";

const ownerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().optional(),
  photo: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  birthday: z.string().optional(),
});

type OwnerFormData = z.infer<typeof ownerSchema>;

interface OwnerFormProps {
  onSubmit: (data: CreateOwnerRequest) => void;
  onCancel: () => void;
  initialData?: OwnerDetail;
  isLoading?: boolean;
  className?: string;
}

/**
 * OwnerForm Component - Molecular Level
 * Form for creating and editing owners
 * Follows Single Responsibility Principle - only handles owner form logic
 */
export const OwnerForm: React.FC<OwnerFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      photo: initialData?.photo || "",
      birthday: initialData?.birthday ? initialData.birthday.split("T")[0] : "",
    },
  });

  const handleFormSubmit = (data: OwnerFormData) => {
    const ownerData: CreateOwnerRequest = {
      name: data.name,
      address: data.address || undefined,
      photo: data.photo || undefined,
      birthday: data.birthday
        ? new Date(data.birthday).toISOString()
        : undefined,
    };
    onSubmit(ownerData);
  };

  return (
    <form
      className={`space-y-4 ${className}`}
      onSubmit={handleSubmit(handleFormSubmit)}
      role="form"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre *
        </label>
        <Input
          id="name"
          data-testid="input-name"
          placeholder="Nombre del propietario"
          {...register("name")}
          error={errors.name?.message}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dirección
        </label>
        <Input
          id="address"
          data-testid="input-address"
          placeholder="Dirección del propietario"
          {...register("address")}
          error={errors.address?.message}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Foto (URL)
        </label>
        <Input
          id="photo"
          data-testid="input-photo"
          type="url"
          placeholder="https://ejemplo.com/foto.jpg"
          {...register("photo")}
          error={errors.photo?.message}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="birthday"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fecha de Nacimiento
        </label>
        <Input
          id="birthday"
          data-testid="input-birthday"
          type="date"
          {...register("birthday")}
          error={errors.birthday?.message}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};
