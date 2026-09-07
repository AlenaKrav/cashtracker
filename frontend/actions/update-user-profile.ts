"use server";

import getToken from "@/src/auth/token";
import {
  ErrorSchema,
  SuccessSchema,
  updateUsersProfileSchema,
} from "@/src/schemas";
import { revalidatePath } from "next/cache";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function updateUserProfile(
  prevState: ActionStateType,
  formData: FormData,
) {
  const updateUserFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
  };

  const validatedUpdateUserFormData =
    updateUsersProfileSchema.safeParse(updateUserFormData);

  if (!validatedUpdateUserFormData.success) {
    const errors = validatedUpdateUserFormData.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const token = getToken();

  const url = `${process.env.API_URL}/auth/user`;
  const request = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: validatedUpdateUserFormData.data.name,
      email: validatedUpdateUserFormData.data.email,
    }),
  });

  const json = await request.json();

  if (!request.ok || json.error) {
    const error = ErrorSchema.parse(json);
    return {
      success: "",
      errors: [],
      serverError: error.error,
    };
  }

  const success = SuccessSchema.parse(json);
  revalidatePath(`/admin/profile/settings`)

  return {
    success: success.message,
    errors: [],
    serverError: "",
  };
}
