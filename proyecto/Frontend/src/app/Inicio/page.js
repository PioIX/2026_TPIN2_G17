"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <h1>Bienvenido</h1>
      <p>Conéctate y chatea en tiempo real</p>

      <div>
        <Button onClick={() => router.push("/login")} text={"Iniciar Sesión"} />
        <Button onClick={() => router.push("/registro")} text={"Registrarse"} />
      </div>
    </>
  );
}